import json
import os

async def send_reminder(booking_id: str):
    # Simulate WhatsApp reminder
    print(f"Reminder scheduled for booking {booking_id}: 1 hour before class")
    print(f"Rating request scheduled for booking {booking_id}: after class completion")
    return True

async def simulate_rating_update(teacher_id: str, new_rating: int):
    # Simulate the user rating the teacher after a class
    teachers_path = "db/teachers.json"
    if os.path.exists(teachers_path):
        with open(teachers_path, "r", encoding="utf-8") as f:
            try:
                teachers = json.load(f)
            except:
                return False
                
        for t in teachers:
            if t["id"] == teacher_id:
                current_rating = t.get("rating", 0.0)
                total_reviews = t.get("total_reviews", 0)
                # Calculate new average rating
                new_avg = ((current_rating * total_reviews) + new_rating) / (total_reviews + 1)
                t["rating"] = round(new_avg, 1)
                t["total_reviews"] = total_reviews + 1
                break
                
        with open(teachers_path, "w", encoding="utf-8") as f:
            json.dump(teachers, f, indent=2)
    return True

async def process_dispute(dispute_req: dict):
    issue_type = dispute_req.get("issue_type", "other")
    
    # 5 DEMO SCENARIOS - Scenario 5: Dispute
    # Auto-resolve within 3 seconds with AI decision
    
    resolution = "Masla note kar liya gaya hai. Hum jald raabta karenge."
    compensation = "None"
    
    if issue_type == "no-show":
        resolution = "Teacher Nahi Aaya: Full refund process ho raha hai"
        compensation = "100% Refund"
    elif issue_type == "quality":
        resolution = "Quality Issue: 50% discount next class pe"
        compensation = "50% Discount on Next Booking"
    elif issue_type == "price":
        resolution = "Price Dispute: Fark wapas ho jayega"
        compensation = "Price Difference Refund"
        
    return {
        "status": "resolved",
        "resolution": resolution,
        "compensation": compensation,
        "reasoning": f"AI resolved based on issue type: {issue_type}"
    }
