import json
import random

areas = ["G-9", "G-10", "G-11", "G-13", "F-7", "F-11", "E-11", "I-8", "Bahria Town", "DHA", "Saddar", "Satellite Town", "Chaklala", "Gulraiz", "PWD"]
specializations = ["Tajweed", "Hifz", "Nazra", "Arabic", "General Quran"]
modes = ["Physical", "Online", "Both"]
names = ["Qari Imranullah Khan", "Hafiz Muhammad Ali", "Qaria Fatima", "Ustad Ahmad", "Qari Abdullah", "Hafiza Ayesha", "Qari Umar", "Ustad Usman", "Qaria Zainab", "Hafiz Bilal", "Qari Tariq", "Ustad Hasan", "Qaria Maryam", "Hafiz Hamza", "Qari Saad", "Ustad Khalid", "Qaria Khadija", "Hafiz Zaid", "Qari Yasir", "Ustad Waqas"]

teachers = []

# Ensure Scenario 1 teacher exists
teachers.append({
    "id": "T001",
    "name": "Qari Imranullah Khan",
    "specializations": ["Tajweed", "Hifz"],
    "areas": ["G-11", "G-10", "G-9"],
    "mode": "Both",
    "rate_per_hour": 600,
    "rating": 4.9,
    "total_reviews": 47,
    "availability": {
        "monday": ["8AM-2PM"],
        "tuesday": ["8AM-2PM"],
        "wednesday": ["8AM-2PM"],
        "thursday": ["8AM-2PM"],
        "friday": ["8AM-11AM"],
        "saturday": ["8AM-1PM"]
    },
    "languages": ["Urdu", "English"],
    "verified": True,
    "experience_years": 8,
    "total_students": 34,
    "response_time": "Usually within 1 hour",
    "cancellation_rate": 0.02,
    "bio": "8 saal ka tajruba, Hifz aur Tajweed mein specialist"
})

# Ensure Scenario 2 teacher exists (Online, budget ~450-500)
teachers.append({
    "id": "T002",
    "name": "Hafiz Muhammad Ali",
    "specializations": ["Hifz", "Nazra"],
    "areas": [],
    "mode": "Online",
    "rate_per_hour": 450,
    "rating": 4.8,
    "total_reviews": 32,
    "availability": {
        "monday": ["4PM-8PM"],
        "tuesday": ["4PM-8PM"],
        "wednesday": ["4PM-8PM"],
        "thursday": ["4PM-8PM"]
    },
    "languages": ["Urdu", "English"],
    "verified": True,
    "experience_years": 5,
    "total_students": 25,
    "response_time": "Usually within 30 mins",
    "cancellation_rate": 0.01,
    "bio": "Online classes specialist with interactive methods."
})

# Ensure Scenario 4 teacher exists (Bahria Town, Nazra)
teachers.append({
    "id": "T003",
    "name": "Qaria Fatima",
    "specializations": ["Nazra", "Tajweed"],
    "areas": ["Bahria Town", "DHA", "PWD"],
    "mode": "Physical",
    "rate_per_hour": 500,
    "rating": 4.7,
    "total_reviews": 28,
    "availability": {
        "monday": ["10AM-2PM"],
        "wednesday": ["10AM-2PM"],
        "friday": ["10AM-12PM"]
    },
    "languages": ["Urdu"],
    "verified": True,
    "experience_years": 6,
    "total_students": 20,
    "response_time": "Usually within 2 hours",
    "cancellation_rate": 0.05,
    "bio": "Specially for kids and females in Bahria Town area."
})

# Generate the remaining 17 teachers
for i in range(4, 21):
    num_areas = random.randint(1, 3)
    teacher_areas = random.sample(areas, num_areas)
    
    num_specs = random.randint(1, 2)
    teacher_specs = random.sample(specializations, num_specs)
    
    teacher_mode = random.choice(modes)
    if teacher_mode == "Online":
        teacher_areas = []
        
    rate = random.choice([300, 400, 500, 600, 700, 800, 900])
    rating = round(random.uniform(4.3, 5.0), 1)
    
    teachers.append({
        "id": f"T{i:03d}",
        "name": names[i-1],
        "specializations": teacher_specs,
        "areas": teacher_areas,
        "mode": teacher_mode,
        "rate_per_hour": rate,
        "rating": rating,
        "total_reviews": random.randint(5, 60),
        "availability": {
            "monday": ["4PM-8PM"],
            "wednesday": ["4PM-8PM"],
            "friday": ["4PM-8PM"]
        },
        "languages": ["Urdu"],
        "verified": random.choice([True, False]),
        "experience_years": random.randint(2, 15),
        "total_students": random.randint(10, 50),
        "response_time": "Usually within 1 hour",
        "cancellation_rate": round(random.uniform(0.01, 0.1), 2),
        "bio": f"{random.randint(2, 15)} saal ka tajruba, {teacher_specs[0]} mein specialist"
    })

with open("backend/db/teachers.json", "w", encoding="utf-8") as f:
    json.dump(teachers, f, indent=2)

with open("backend/db/bookings.json", "w", encoding="utf-8") as f:
    json.dump([], f)
    
with open("backend/logs/agent_logs.json", "w", encoding="utf-8") as f:
    json.dump([], f)
