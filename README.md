# 🕌 Bunyan-un-Marsoos — AI-Powered Quran Teacher Booking Platform

> **"بُنیانٌ مَرصُوص"** — A structure cemented firmly. (Surah As-Saff, 61:4)

An AI-powered, multi-agent platform that connects Quran students with verified teachers across Islamabad/Rawalpindi using **Google Gemini AI**, **Google Maps API**, and real-time agentic workflows.

---

## 🏆 Built for AI Seekho 2026 Competition — Powered by Google Antigravity

## 🌐 Live Links

| Platform | URL |
|----------|-----|
| 📱 **Web App** | [https://mobile-pearl-psi.vercel.app](https://mobile-pearl-psi.vercel.app) |
| ⚙️ **Backend API** | [https://backend-flame-nine-61.vercel.app](https://backend-flame-nine-61.vercel.app) |
| 💻 **GitHub Repo** | [https://github.com/awaislearnspython786-a11y/bunyan-un-marsoos](https://github.com/awaislearnspython786-a11y/bunyan-un-marsoos) |

---

## 🧠 Architecture Overview

```
┌───────────────┐        ┌─────────────────────────────────────────┐
│   Mobile App  │◄──────►│         FastAPI Backend (Vercel)        │
│  (Expo + Web) │  REST  │                                         │
└───────────────┘        │  ┌─────────────┐  ┌──────────────────┐ │
                         │  │ Agent 1:    │  │ Agent 2:         │ │
                         │  │ Intent      │  │ Teacher Matcher  │ │
                         │  │ Parser      │  │ (Gemini + Maps)  │ │
                         │  │ (Gemini AI) │  │                  │ │
                         │  └─────────────┘  └──────────────────┘ │
                         │                                         │
                         │  ┌─────────────┐  ┌──────────────────┐ │
                         │  │ Agent 3:    │  │ Agent 4:         │ │
                         │  │ Booking     │  │ Follow-up &      │ │
                         │  │ Executor    │  │ Dispute Resolver │ │
                         │  └─────────────┘  └──────────────────┘ │
                         └─────────────────────────────────────────┘
```

---

## 🤖 AI Agents (4 Autonomous Agents)

### Agent 1: Intent Parser 🧠
- **API**: Google Gemini 1.5 Flash
- **Purpose**: Understands natural language queries in English, Urdu, and Roman Urdu
- **Input**: `"Mujhe G-11 mein tajweed ka teacher chahiye sham ko, budget 500"`
- **Output**: Structured JSON with specialization, mode, location, time, budget, language, confidence
- **Key Feature**: Multilingual NLP — processes mixed-language queries with confidence scoring

### Agent 2: Teacher Matcher 🎯
- **APIs**: Google Gemini AI + Google Maps Distance Matrix + Google Places
- **Purpose**: Scores and ranks teachers using a weighted multi-factor algorithm
- **Scoring Breakdown**:
  - Specialization Match: 30 points
  - Mode Match: 20 points
  - Area Proximity (Google Maps Distance): 20 points
  - Availability Check: 10 points
  - Rating Score: 10 points
  - Price Match: 10 points
- **Key Feature**: Uses Google Maps Distance Matrix API for real-time distance calculation (< 5km, < 15km thresholds). Also fetches nearby Quran academies from Google Places.

### Agent 3: Booking Executor 📋
- **Purpose**: Handles booking creation with dynamic pricing
- **Features**:
  - 10% discount for online mode
  - 15% peak hour surcharge (evening)
  - Auto-generates WhatsApp confirmation messages in Urdu
  - Unique booking ID generation (BUN-2026-XXXX format)

### Agent 4: Follow-up & Dispute Manager 🛡️
- **Purpose**: Handles post-booking workflows
- **Features**:
  - WhatsApp reminder scheduling (1 hour before class)
  - AI-powered dispute resolution within 3 seconds
  - Auto-compensation: Full refund (no-show), 50% discount (quality), price difference (price dispute)
  - Rating update system with running average calculation

---

## 📱 App Features & Screens

| Screen | Description |
|--------|-------------|
| **Splash Screen** | Animated app intro with branding |
| **Role Selection** | Choose: Student, Teacher, or Admin |
| **Login/Signup** | Phone-based auth with SHA-256 password hashing |
| **Home (Search)** | AI-powered natural language search in Urdu/English |
| **Loading Screen** | Real-time AI processing animation |
| **Results** | Ranked teacher cards with match scores |
| **Teacher Profile** | Full profile with rating, experience, availability |
| **Booking** | Dynamic pricing with mode/time adjustments |
| **Confirmation** | WhatsApp message preview + booking ID |
| **Disputes** | AI auto-resolution in 3 seconds |
| **AI Logs** | Full transparency — see every AI decision |
| **Admin Dashboard** | Monitor teachers, students, and deals |
| **Teacher Dashboard** | Teacher's own booking management |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React Native (Expo) + Expo Web |
| **Backend** | Python FastAPI |
| **AI Engine** | Google Gemini 1.5 Flash API |
| **Location** | Google Maps Distance Matrix + Places API |
| **Hosting** | Vercel (Serverless, 24/7) |
| **Auth** | SHA-256 hashed passwords |
| **Data** | JSON-based storage |
| **Development** | Google Antigravity AI Coding Assistant |

---

## 🔑 APIs Used

1. **Google Gemini AI (gemini-1.5-flash)** — Intent parsing, teacher recommendations
2. **Google Maps Distance Matrix API** — Real-time distance calculation between student and teacher locations
3. **Google Maps Places API** — Fetching nearby Quran academies and Madrassas
4. **FastAPI REST API** — 8 endpoints serving the entire application

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/parse-intent` | AI parses natural language query |
| POST | `/api/match-teachers` | AI matches and ranks teachers |
| POST | `/api/create-booking` | Creates booking with dynamic pricing |
| POST | `/api/submit-dispute` | AI resolves disputes in 3 seconds |
| GET | `/api/agent-logs` | Returns all AI decision logs |
| POST | `/api/auth/login` | Phone-based login |
| POST | `/api/auth/signup/teacher` | Teacher registration |
| POST | `/api/auth/signup/student` | Student registration |
| GET | `/api/admin/dashboard` | Admin dashboard data |

---

## 🏃 How to Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python generate_data.py   # Generate sample teachers
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Mobile
```bash
cd mobile
npm install
npx expo start --web      # For browser
npx expo start             # For Expo Go on phone
```

---

## 🎬 Demo Scenarios

1. **Search**: Type `"Mujhe G-11 mein tajweed ka teacher chahiye sham ko"` → AI parses intent → Matches teachers → Book
2. **Online Budget**: `"Online hifz teacher chahiye 500 ke andar"` → Budget-filtered results
3. **Role-based**: Login as Admin → See all teachers, students, deals dashboard
4. **Dispute**: Submit a "no-show" dispute → AI resolves in 3 seconds with full refund
5. **AI Transparency**: Check "AI Logs" tab → See every step the AI took with confidence scores

---

## 👨‍💻 Team

**Muhammad Awais Sarwar**

---

## 🌟 What Makes This Special?

1. **4 Autonomous AI Agents** working in pipeline
2. **Real Google Gemini API** for NLP (not mocked)
3. **Real Google Maps API** for distance-based matching
4. **Multilingual**: English + Urdu + Roman Urdu
5. **Full AI Transparency**: Every AI decision is logged and viewable
6. **Built entirely with Google Antigravity** AI coding assistant
7. **Live 24/7** on Vercel — no laptop needed

---

> *"Indeed, Allah loves those who fight in His cause in a row as though they are a structure joined firmly (Bunyan-un-Marsoos)."* — Quran 61:4
