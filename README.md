# 🌟 ImpactHub — Smart Community Volunteer Platform

<div align="center">

![ImpactHub Banner](https://img.shields.io/badge/ImpactHub-Smart%20Resource%20Allocation-6366f1?style=for-the-badge&logo=lightning&logoColor=white)

[![Google Solution Challenge](https://img.shields.io/badge/Google%20Solution%20Challenge-Build%20with%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/community/gdsc-solution-challenge)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

### 🏆 Google Solution Challenge — Build with AI
### 🏫 Shri S'ad Vidya Mandal Institute of Technology

</div>

---

## 👥 Team Code Samuraai

| Name | Role |
|------|------|
| 👑 **Drashti Savaliya** | Team Leader & Full Stack Developer |
| 💻 **Shreya Lad** | Frontend Developer & UI/UX Designer |
| ⚙️ **Kaushal Patel** | Backend Developer & AI Integration |
| 🗄️ **Manav Surti** | Database Architect & API Developer |

---

## 🚨 Problem Statement

Local social groups and NGOs collect a lot of important information about community needs through **paper surveys and field reports**. However, this valuable data is often:

- 📋 **Scattered** across different places and formats
- 👁️ **Hard to visualize** — making it difficult to see the biggest problems clearly
- 🔗 **Disconnected** — volunteers and NGOs are not efficiently matched to needs
- ⏰ **Slow to respond** — critical community needs go unaddressed due to poor coordination
- 📊 **Lacking insights** — no data-driven approach to prioritize resources

> **The result?** Communities in need suffer while available resources go underutilized.

---

## 💡 Our Solution — ImpactHub

**ImpactHub** is an AI-powered smart resource allocation platform that:

1. **Centralizes** scattered community needs from field reports and surveys
2. **Visualizes** the most urgent local needs through intuitive dashboards
3. **Intelligently matches** available NGOs with specific tasks using our Smart Match algorithm
4. **Automates analysis** of field reports using Gemini AI (Flash 2.0)
5. **Provides actionable insights** for community coordinators

---

## 🎯 UN Sustainable Development Goals (SDGs)

This project aligns with the following UN SDGs:

| SDG | Goal |
|-----|------|
| 🏙️ **SDG 11** | Sustainable Cities and Communities |
| 🤝 **SDG 17** | Partnerships for the Goals |
| ❤️ **SDG 3** | Good Health and Well-being |
| 📚 **SDG 4** | Quality Education |
| 🍽️ **SDG 2** | Zero Hunger |

---

## ✨ Key Features

### 📊 Smart Dashboard
- Real-time overview of community needs, NGO capacity, and active assignments
- Interactive bar chart showing needs by category
- Urgency breakdown donut chart (Critical / High / Medium / Low)
- Recent activity feed with live updates

### 🗺️ Community Needs Management
- Report, track, and prioritize community needs
- Filter by urgency level and status
- Volunteer progress tracking with visual progress bars
- Full CRUD operations with modal forms

### 🏢 NGO Directory
- Register and manage partner NGOs
- Track efficiency scores, specializations, and capacity
- Service radius management (Local / District / Regional)
- Real-time assignment capacity monitoring

### ⚡ Smart Match Algorithm
- AI-powered NGO-to-Need matching system
- **Match Score Formula:**
  - 🎯 Efficiency Score → **40 points** (based on NGO performance)
  - 📍 Location Score → **35 points** (based on proximity)
  - 🔧 Specialization Score → **25 points** (based on skill alignment)
- One-click assignment with instant status updates

### 📋 Field Reports
- Submit field observations, surveys, and assessments
- Convert field reports directly into community needs
- Search and filter reports by location and category
- Track conversion status with visual badges

### 🤖 AI Features (Powered by Gemini — Flash 2.0)

| Feature | Description |
|---------|-------------|
| 💬 **AI Chatbot** | Ask questions about community needs in natural language |
| ✨ **Community Insights** | AI analyzes all data and provides actionable recommendations |
| 🔍 **Report Analyzer** | Auto-suggests urgency, category, and key findings from field reports |
| 🤝 **Match Explainer** | AI explains why a specific NGO was matched to a need |

### 🔐 Authentication
- JWT-based secure authentication
- Google OAuth 2.0 integration
- Role-based access control (Admin / Volunteer)
- Protected routes with session management

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js** | UI Framework |
| **Vite 8** | Build Tool |
| **Tailwind CSS v4** | Styling |
| **React Router v6** | Navigation |
| **Chart.js + React-Chartjs-2** | Data Visualization |
| **Axios** | HTTP Client |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **Passport.js** | Google OAuth |
| **Bcrypt.js** | Password Hashing |

### AI & External Services
| Service | Purpose |
|---------|---------|
| **Google AI (2.5 flash)** | AI Analysis & Chatbot |
| **Google OAuth 2.0** | Social Authentication |

---

## 🏗️ Project Architecture

```
ImpactHub/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # Google OAuth config
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── needsController.js # Community needs CRUD
│   │   ├── ngosController.js  # NGO management
│   │   ├── reportsController.js # Field reports
│   │   ├── matchController.js # Smart match algorithm
│   │   └── aiController.js    # AI features
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Need.js            # Community need schema
│   │   ├── NGO.js             # NGO schema
│   │   ├── FieldReport.js     # Field report schema
│   │   └── Assignment.js      # Assignment schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── needs.js           # Needs routes
│   │   ├── ngos.js            # NGO routes
│   │   ├── reports.js         # Reports routes
│   │   ├── match.js           # Match routes
│   │   └── ai.js              # AI routes
│   ├── services/
│   │   └── aiService.js       # Gemini AI integration
│   └── server.js              # Express app entry point
│
└── frontend/                   # React + Vite application
    └── src/
        ├── api/               # Axios API functions
        ├── components/
        │   ├── layout/        # Sidebar + Layout
        │   └── shared/        # Reusable components
        ├── context/           # Auth context
        ├── pages/             # All application pages
        ├── App.jsx            # Root component
        └── main.jsx           # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js v18+](https://nodejs.org/)
- [MongoDB Community v7+](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/impacthub.git
cd impacthub
```

**2. Setup Backend:**
```bash
cd backend
npm install
```

**3. Create `backend/.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/impacthub
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_api_key
```

**4. Seed the database:**
```bash
npm run seed
```

**5. Start the backend:**
```bash
npm run dev
```

**6. Setup Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```

**7. Open your browser:**
```
http://localhost:5173
```

### Test Accounts
```
Admin     → admin@impacthub.com     / admin123
Volunteer → volunteer@impacthub.com / volunteer123
```

---

## 🧠 Smart Match Algorithm

```
Match Score = Efficiency Score + Location Score + Specialization Score

Efficiency Score  (40 pts) → Based on NGO historical performance
Location Score    (35 pts) → Based on proximity to community need
Specialization    (25 pts) → Based on NGO skills vs need requirements

Total Maximum Score = 100 points
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/logout` | Logout user |

### Community Needs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/needs` | Get all needs |
| POST | `/api/needs` | Create new need |
| PUT | `/api/needs/:id` | Update need |
| DELETE | `/api/needs/:id` | Delete need |
| GET | `/api/needs/stats` | Get dashboard stats |

### NGOs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ngos` | Get all NGOs |
| POST | `/api/ngos` | Register new NGO |
| PUT | `/api/ngos/:id` | Update NGO |
| DELETE | `/api/ngos/:id` | Delete NGO |

### Field Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Submit new report |
| DELETE | `/api/reports/:id` | Delete report |
| POST | `/api/reports/:id/convert` | Convert to need |

### Smart Match
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/match` | Get smart matches |
| POST | `/api/match/assign` | Assign NGO to need |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze-report` | Analyze field report |
| POST | `/api/ai/generate-description` | Generate need description |
| POST | `/api/ai/explain-match` | Explain NGO-Need match |
| GET | `/api/ai/insights` | Get community insights |
| POST | `/api/ai/chat` | AI chatbot |

---

## 🌍 Impact & Vision

### Current Impact
- ✅ Centralizes scattered community data into one platform
- ✅ Reduces time to match NGOs with needs from days to seconds
- ✅ AI-powered insights help prioritize the most critical needs
- ✅ Field reports directly convert to actionable community needs

### Future Vision
- 📱 Mobile app for field workers
- 🗺️ Interactive map showing needs by location
- 📧 Real-time email/SMS alerts for critical needs
- 📊 Predictive analytics for upcoming community needs
- 🌐 Multi-language support for diverse communities

---

## 👨‍💻 Development Team

<div align="center">

### 🏆 Team Code Samuraai
#### Shri S'ad Vidya Mandal Institute of Technology

| | Name | Role |
|--|------|------|
| 👑 | **Drashti Savaliya** | Team Leader & Testing & Debugging |
| 💻 | **Shreya Lad** | Frontend Developer & UI/UX Designer |
| ⚙️ | **Kaushal Patel** | Backend Developer & AI Integration |
| 🗄️ | **Manav Surti** | Database Architect & API Developer |

</div>

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Solution Challenge](https://developers.google.com/community/gdsc-solution-challenge) for the inspiration
- [Gemini](https://gemini.google.com) for blazing fast AI inference
- [MongoDB](https://www.mongodb.com/) for database
- [Lucide React](https://lucide.dev/) for beautiful icons
- All the communities and NGOs whose real-world challenges inspired this solution

---

<div align="center">

**Built with ❤️ by Team Code Samuraai**

*Empowering communities through smart technology*

⭐ Star this repo if you found it helpful!

</div>
