from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import hashlib
from datetime import datetime
import uuid
from dotenv import load_dotenv

load_dotenv()

# Import agents
from agents.intent_parser import parse_intent
from agents.teacher_matcher import match_teachers
from agents.booking_executor import create_booking
from agents.followup_manager import process_dispute, send_reminder

app = FastAPI(title="Bunyan-un-Marsoos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IntentRequest(BaseModel):
    query: str

class MatchRequest(BaseModel):
    specialization: str | None = None
    mode: str | None = None
    location: str | None = None
    time_preference: str | None = None
    budget_pkr: int | None = None
    language_detected: str | None = None
    confidence: float | None = None

class BookingRequest(BaseModel):
    teacher_id: str
    student_name: str
    phone: str
    time_slot: str
    mode: str

class DisputeRequest(BaseModel):
    booking_id: str
    issue_type: str
    description: str

class LoginRequest(BaseModel):
    username: str
    password: str

class TeacherSignupRequest(BaseModel):
    name: str
    address: str
    phone: str
    experience: str
    area_of_interest: str
    password: str

class StudentSignupRequest(BaseModel):
    name: str
    address: str
    phone: str
    password: str

def log_agent_action(step: str, input_data: any, output_data: any, reasoning: str, confidence: float = 1.0, duration_ms: int = 100, language: str = "N/A"):
    log_file = "logs/agent_logs.json"
    if not os.path.exists("logs"):
        os.makedirs("logs")
        
    logs = []
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            try:
                logs = json.load(f)
            except:
                pass
                
    # Keep session id consistent for a single flow if possible, but for simplicity generating new or using a simple strategy
    # A real app would pass session_id from frontend
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "session_id": f"BUN-SESSION-{uuid.uuid4().hex[:8].upper()}",
        "step": step,
        "input": str(input_data),
        "language_detected": language,
        "reasoning": reasoning,
        "confidence": confidence,
        "output": output_data,
        "duration_ms": duration_ms
    }
    
    logs.append(log_entry)
    with open(log_file, "w") as f:
        json.dump(logs, f, indent=2)
        
    return log_entry

@app.post("/api/parse-intent")
async def api_parse_intent(req: IntentRequest):
    result = await parse_intent(req.query)
    log = log_agent_action(
        step="intent_parser",
        input_data=req.query,
        output_data=result,
        reasoning=result.get("reasoning", "Parsed intent using Mocked/Claude logic"),
        confidence=result.get("confidence", 0.9),
        duration_ms=result.get("duration_ms", 245),
        language=result.get("language_detected", "Mixed")
    )
    return {"intent": result, "log": log}

@app.post("/api/match-teachers")
async def api_match_teachers(req: MatchRequest):
    result = await match_teachers(req.model_dump())
    
    # Calculate a reasoning string for the log
    reasoning = "Searched teachers with Google Maps Distance and Gemini logic.\n"
    for r in result["matches"]:
        reasoning += f"{r['teacher']['name']}: {r['total_score']} pts\n"

    log = log_agent_action(
        step="teacher_matcher",
        input_data=req.model_dump(),
        output_data=result,
        reasoning=reasoning,
        confidence=0.95,
        duration_ms=800
    )
    return {"matches": result["matches"], "businesses": result["businesses"], "log": log}

@app.post("/api/create-booking")
async def api_create_booking(req: BookingRequest):
    result = await create_booking(req.model_dump())
    log = log_agent_action(
        step="booking_executor",
        input_data=req.model_dump(),
        output_data=result,
        reasoning=f"Booking ID generated: {result['booking_id']}. Pricing calculation shown step by step. WhatsApp message generated. Saved to database.",
        confidence=1.0,
        duration_ms=180
    )
    
    # Trigger followup agent
    await send_reminder(result["booking_id"])
    
    return {"booking": result, "log": log}

@app.post("/api/submit-dispute")
async def api_submit_dispute(req: DisputeRequest):
    import asyncio
    await asyncio.sleep(3) # simulate 3 second AI decision
    
    result = await process_dispute(req.model_dump())
    log = log_agent_action(
        step="dispute_resolver",
        input_data=req.model_dump(),
        output_data=result,
        reasoning=result.get("reasoning", "Auto-resolved dispute based on issue type"),
        confidence=0.98,
        duration_ms=3000
    )
    return {"resolution": result, "log": log}

@app.get("/api/agent-logs")
async def api_agent_logs():
    log_file = "logs/agent_logs.json"
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            try:
                # Return in reverse chronological order so latest are on top, or original order
                return json.load(f)
            except:
                return []
    return []

@app.post("/api/auth/login")
async def api_login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin123":
        return {"success": True, "role": "admin", "name": "Administrator"}
    
    hashed_password = hashlib.sha256(req.password.encode()).hexdigest()
    
    # check users.json
    users_path = "db/users.json"
    if os.path.exists(users_path):
        with open(users_path, "r", encoding="utf-8") as f:
            try:
                users = json.load(f)
                for u in users:
                    if u.get("phone") == req.username:
                        if u.get("password") == hashed_password:
                            return {"success": True, "role": u.get("role"), "name": u.get("name"), "user_id": u.get("id")}
                        else:
                            return {"success": False, "message": "Incorrect password"}
            except:
                pass
    return {"success": False, "message": "Phone number not found"}

@app.post("/api/auth/signup/teacher")
async def api_signup_teacher(req: TeacherSignupRequest):
    users_path = "db/users.json"
    users = []
    if os.path.exists(users_path):
        with open(users_path, "r", encoding="utf-8") as f:
            try:
                users = json.load(f)
            except:
                pass
    
    hashed_password = hashlib.sha256(req.password.encode()).hexdigest()
    teacher_id = f"T-{uuid.uuid4().hex[:6].upper()}"
    new_user = {
        "id": teacher_id,
        "role": "teacher",
        "name": req.name,
        "address": req.address,
        "phone": req.phone,
        "experience": req.experience,
        "area_of_interest": req.area_of_interest,
        "password": hashed_password
    }
    users.append(new_user)
    with open(users_path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)
        
    # Also add to teachers.json to be searchable
    teachers_path = "db/teachers.json"
    teachers = []
    if os.path.exists(teachers_path):
        with open(teachers_path, "r", encoding="utf-8") as f:
            try:
                teachers = json.load(f)
            except:
                pass
    
    new_teacher_record = {
        "id": teacher_id,
        "name": req.name,
        "specializations": [req.area_of_interest],
        "areas": [req.address],
        "mode": "Both",
        "rate_per_hour": 500,
        "rating": 5.0,
        "total_reviews": 0,
        "availability": {
            "monday": ["4PM-8PM"]
        },
        "languages": ["Urdu"],
        "verified": False,
        "experience_years": req.experience,
        "total_students": 0,
        "response_time": "New",
        "cancellation_rate": 0.0,
        "bio": f"New teacher from {req.address} with {req.experience} experience."
    }
    teachers.append(new_teacher_record)
    with open(teachers_path, "w", encoding="utf-8") as f:
        json.dump(teachers, f, indent=2)

    return {"success": True, "role": "teacher", "name": req.name, "user_id": teacher_id}

@app.post("/api/auth/signup/student")
async def api_signup_student(req: StudentSignupRequest):
    users_path = "db/users.json"
    users = []
    if os.path.exists(users_path):
        with open(users_path, "r", encoding="utf-8") as f:
            try:
                users = json.load(f)
            except:
                pass
    
    hashed_password = hashlib.sha256(req.password.encode()).hexdigest()
    student_id = f"S-{uuid.uuid4().hex[:6].upper()}"
    new_user = {
        "id": student_id,
        "role": "student",
        "name": req.name,
        "address": req.address,
        "phone": req.phone,
        "password": hashed_password
    }
    users.append(new_user)
    with open(users_path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)

    return {"success": True, "role": "student", "name": req.name, "user_id": student_id}

@app.get("/api/admin/dashboard")
async def api_admin_dashboard():
    dashboard = {
        "teachers": [],
        "students": [],
        "deals": []
    }
    
    try:
        if os.path.exists("db/teachers.json"):
            with open("db/teachers.json", "r", encoding="utf-8") as f:
                dashboard["teachers"] = json.load(f)
                
        if os.path.exists("db/users.json"):
            with open("db/users.json", "r", encoding="utf-8") as f:
                users = json.load(f)
                dashboard["students"] = [u for u in users if u.get("role") == "student"]
                
        if os.path.exists("db/bookings.json"):
            with open("db/bookings.json", "r", encoding="utf-8") as f:
                dashboard["deals"] = json.load(f)
    except Exception as e:
        pass
        
    return dashboard
