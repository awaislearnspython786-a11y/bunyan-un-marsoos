import json
import os
import googlemaps
import google.generativeai as genai

async def match_teachers(intent: dict):
    gmaps = googlemaps.Client(key=os.environ.get("GOOGLE_MAPS_API_KEY"))
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    
    teachers_path = "db/teachers.json"
    if not os.path.exists(teachers_path):
        return {"matches": [], "businesses": []}
        
    with open(teachers_path, "r", encoding="utf-8") as f:
        teachers = json.load(f)
        
    results = []
    req_location = intent.get("location")
    req_mode = intent.get("mode")
    req_time = intent.get("time_preference")
    
    # 1. Fetch Google Places (Related Businesses)
    businesses = []
    if req_location:
        try:
            places_result = gmaps.places(query=f"Quran Academy or Madrassa in {req_location}")
            if places_result.get('status') == 'OK':
                for place in places_result['results'][:3]:
                    businesses.append({
                        "name": place.get('name'),
                        "address": place.get('formatted_address'),
                        "rating": place.get('rating', 'N/A')
                    })
        except Exception as e:
            print(f"Google Places API Error: {e}")

    for t in teachers:
        score_breakdown = {
            "specialization": 0,
            "mode": 0,
            "area": 0,
            "rating": 0,
            "price": 0,
            "availability": 0
        }
        
        # 1. Availability Check (Real-time Filter)
        t_avail = t.get("availability", {})
        is_available = True
        if req_time and req_time != "Any":
            found_slot = False
            for day, slots in t_avail.items():
                for slot in slots:
                    if req_time.lower() in slot.lower() or ("Morning" in req_time and "AM" in slot) or ("Evening" in req_time and "PM" in slot):
                        found_slot = True
                        break
            if not found_slot:
                is_available = False
                
        if not is_available:
            continue # Skip this teacher
            
        score_breakdown["availability"] = 10
        
        # 2. Specialization match (30%)
        req_spec = intent.get("specialization")
        if req_spec and req_spec in t.get("specializations", []):
            score_breakdown["specialization"] = 30
        elif req_spec == "Any" or not req_spec:
            score_breakdown["specialization"] = 30
        elif req_spec:
            score_breakdown["specialization"] = 10
            
        # 3. Mode match (20%)
        t_mode = t.get("mode")
        if req_mode == t_mode or t_mode == "Both" or req_mode == "Any" or not req_mode:
            score_breakdown["mode"] = 20
        elif req_mode == "Physical" and t_mode == "Online":
            score_breakdown["mode"] = 0
        elif req_mode == "Online" and t_mode == "Physical":
            score_breakdown["mode"] = 0
            
        # 4. Area match using Google Maps Distance (20%)
        if req_location and t.get("areas"):
            try:
                dist_result = gmaps.distance_matrix(req_location, t["areas"][0])
                if dist_result['status'] == 'OK' and dist_result['rows'][0]['elements'][0]['status'] == 'OK':
                    dist_val = dist_result['rows'][0]['elements'][0]['distance']['value']
                    
                    if dist_val < 5000: # < 5km
                        score_breakdown["area"] = 20
                    elif dist_val < 15000: # < 15km
                        score_breakdown["area"] = 10
                    else:
                        score_breakdown["area"] = 0
                else:
                     score_breakdown["area"] = 5 
            except:
                score_breakdown["area"] = 5
        elif not req_location:
            score_breakdown["area"] = 20
            
        # 5. Rating (10%)
        rating = t.get("rating", 0)
        score_breakdown["rating"] = int((rating / 5.0) * 10)
        
        # 6. Price (10%)
        req_price = intent.get("budget_pkr")
        t_price = t.get("rate_per_hour", 500)
        if req_price:
            if t_price <= req_price:
                score_breakdown["price"] = 10
            else:
                score_breakdown["price"] = max(0, 10 - int((t_price - req_price)/100))
        else:
            score_breakdown["price"] = 8
        
        total_score = sum(score_breakdown.values())
        
        results.append({
            "teacher": t,
            "total_score": total_score,
            "score_breakdown": score_breakdown,
            "reasoning": ""
        })
        
    results.sort(key=lambda x: x["total_score"], reverse=True)
    top_results = results[:3]
    
    # Generate recommendations for top 3
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        for match in top_results:
            t = match["teacher"]
            prompt = f"In 1 very short sentence, recommend this Quran teacher to a student. Student needs: {intent}. Teacher offers: {t['specializations']}, {t['areas']}, Rating: {t['rating']}. Do not use markdown."
            resp = model.generate_content(prompt)
            match["reasoning"] = resp.text.strip()
    except Exception as e:
        for match in top_results:
            match["reasoning"] = f"{match['teacher']['areas'][0]} mein hai, {match['total_score']}% match."

    return {"matches": top_results, "businesses": businesses}
