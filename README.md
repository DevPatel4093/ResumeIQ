# AI Resume Analyzer

## 📌 Project Overview

AI Resume Analyzer is a full-stack web application that leverages Artificial Intelligence to analyze resumes against job descriptions, calculate ATS (Applicant Tracking System) compatibility scores, identify missing skills, and provide personalized recommendations to improve a candidate's chances of getting shortlisted.

The platform helps job seekers optimize their resumes while assisting recruiters in evaluating candidate profiles more efficiently.

---

## 🚀 Features

### Authentication & Authorization

* User Registration and Login
* JWT-Based Authentication
* Secure Protected Routes

### Resume Management

* Upload Resume (PDF/DOCX)
* Resume Parsing and Information Extraction
* Resume Preview

### AI-Powered Analysis

* ATS Score Calculation
* Resume-to-Job Description Matching
* Skill Gap Analysis
* Keyword Optimization Suggestions
* Personalized Resume Feedback

### Analytics Dashboard

* ATS Score Visualization
* Analysis History
* Resume Performance Tracking
* Skill Distribution Insights

### Reports

* Detailed Analysis Reports
* Downloadable PDF Reports

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* React Icons

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer
* bcrypt.js

### Database

* MongoDB Atlas
  
### AI & Resume Processing

* Google Gemini API / OpenAI API
* PDF-Parse
* Mammoth.js
* Natural Language Processing (NLP)

---

## 📂 Project Structure

```bash
AI-Resume-Analyzer
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── services
│   │   ├── context
│   │   ├── hooks
│   │   ├── utils
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── services
│   ├── config
│   ├── uploads
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Start Backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install
```


Start Frontend:

```bash
npm run dev
```

---

## 📊 Workflow

1. User uploads a resume.
2. System extracts resume content.
3. User enters a job description.
4. AI analyzes resume against requirements.
5. ATS score is generated.
6. Missing skills are identified.
7. AI provides strengths, weaknesses, and recommendations.
8. Results are displayed on the dashboard.
9. User can download the analysis report.

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

### Resume

```http
POST /api/resume/upload

GET /api/resume/all

GET /api/resume/:id
```

### Analysis

```http
POST /api/analyze

GET /api/analyze/history

GET /api/analyze/:id
```

---

## 📈 Future Enhancements

* AI Resume Builder
* Cover Letter Generator
* Interview Question Generator
* Resume Ranking System
* Multiple Job Description Comparison
* Recruiter Dashboard
* Career Recommendation Engine

---

## 🎯 Learning Outcomes

Through this project, the following concepts were implemented:

* Full Stack MERN Development
* REST API Development
* Authentication & Authorization
* File Upload Handling
* Resume Parsing
* AI Integration
* ATS Scoring Logic
* MongoDB Database Management
* Dashboard Analytics
* Cloud Deployment

---

## 👨‍💻 Author

**Dev Patel**

---

## 📄 License

This project is licensed under the MIT License.
