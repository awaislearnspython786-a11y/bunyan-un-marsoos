import os
import json
import google.generativeai as genai
import time

async def parse_intent(query: str):
    start_time = time.time()
    
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    
    prompt = f"""
    You are an AI assistant for a Quran Teacher booking app based in Rawalpindi and Islamabad, Pakistan.
    Your task is to parse the following user query (which might be in English, Urdu, or Roman Urdu) and extract structured booking criteria.
    
    User Query: "{query}"
    
    Extract the following fields and return ONLY a valid JSON object:
    - "specialization": The subject requested (e.g., "Tajweed", "Hifz", "Nazra", "Arabic", "General"). Default to "General" if unclear.
    - "mode": "Physical" or "Online". Default to "Any". (If location is specified, it usually implies Physical unless stated otherwise).
    - "location": The requested area (e.g., "G-11", "Bahria Town", "DHA Phase 2"). 
      CRITICAL: Only accept locations within Rawalpindi or Islamabad. If the location is clearly outside these cities, set it to null.
    - "time_preference": e.g., "Morning", "Evening", "Any".
    - "budget_pkr": Extract any budget mentioned in Pakistani Rupees as an integer. If none, set to null.
    - "language_detected": "English", "Urdu", "Roman Urdu", or "Mixed".
    - "confidence": A float between 0.0 and 1.0 representing your confidence in the extraction.
    - "reasoning": A 1-2 sentence explanation of your extraction and location validation.
    
    Return ONLY JSON. No markdown formatting, no code blocks, just the raw JSON string.
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # Clean up potential markdown formatting from the response
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        parsed_data = json.loads(response_text)
        
        # Calculate duration
        duration_ms = int((time.time() - start_time) * 1000)
        parsed_data["duration_ms"] = duration_ms
        
        return parsed_data
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Fallback to a basic extraction if API fails
        return {
            "specialization": "General",
            "mode": "Any",
            "location": None,
            "time_preference": "Any",
            "budget_pkr": None,
            "language_detected": "Mixed",
            "confidence": 0.5,
            "reasoning": f"Fallback extraction due to AI parsing error: {e}",
            "duration_ms": int((time.time() - start_time) * 1000)
        }
