import json
import os
import uuid
import random
from datetime import datetime

async def create_booking(booking_req: dict):
    # Load teacher to get base rate
    teachers_path = "db/teachers.json"
    teacher = None
    if os.path.exists(teachers_path):
        with open(teachers_path, "r", encoding="utf-8") as f:
            teachers = json.load(f)
            for t in teachers:
                if t["id"] == booking_req["teacher_id"]:
                    teacher = t
                    break
                    
    if not teacher:
        raise Exception("Teacher not found")
        
    base_rate = teacher["rate_per_hour"]
    price = float(base_rate)
    
    mode = booking_req["mode"]
    time_slot = booking_req["time_slot"]
    
    if mode == "Online":
        price *= 0.90 # -10% online discount
        
    # peak hours: evening
    if time_slot == "Shaam (4PM - 8PM)":
        price *= 1.15 # +15% peak surcharge
        
    final_price = int(price)
    
    # Generate ID
    booking_id = f"BUN-2026-{str(random.randint(1000, 9999))}"
    
    # Generate WhatsApp message
    whatsapp_message = f"""Assalam o Alaikum! Aapki booking confirm ho gayi.
Ustaz: {teacher['name']} | Subject: {teacher['specializations'][0]}
Waqt: {time_slot} | Jagah: {mode}
Fee: Rs.{final_price} | Booking ID: {booking_id}
JazakAllah Khair!"""

    booking_record = {
        "booking_id": booking_id,
        "teacher_id": teacher["id"],
        "student_name": booking_req["student_name"],
        "phone": booking_req["phone"],
        "time_slot": time_slot,
        "mode": mode,
        "final_price": final_price,
        "whatsapp_message": whatsapp_message,
        "created_at": datetime.now().isoformat()
    }
    
    # Save to db
    bookings_path = "db/bookings.json"
    bookings = []
    if os.path.exists(bookings_path):
        with open(bookings_path, "r", encoding="utf-8") as f:
            try:
                bookings = json.load(f)
            except:
                pass
                
    bookings.append(booking_record)
    
    with open(bookings_path, "w", encoding="utf-8") as f:
        json.dump(bookings, f, indent=2)
        
    return booking_record
