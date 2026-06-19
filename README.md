# AI Resume Analyzer

Full-stack MERN-style project that evaluates resumes against job descriptions. It supports authentication, PDF/DOCX upload, resume parsing, ATS scoring, skill gap analysis, candidate history, admin statistics, and downloadable reports.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, React Icons
- Backend: Node.js, Express, JWT, Multer, PDF/DOCX parsing, optional MongoDB/Mongoose
- AI: deterministic local analyzer by default, optional OpenAI-compatible hook via `OPENAI_API_KEY`

## Quick Start

```bash
npm run install:all
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

The app runs without MongoDB by using in-memory storage. Add `MONGO_URI` in `backend/.env` for persistent MongoDB Atlas storage.

## Demo Accounts

When running without MongoDB, register any user from the UI. To create an admin, register with the role set to `admin` through the API or update the role in MongoDB.

## Environment

Copy `backend/.env.example` to `backend/.env`.

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=change-this-secret
MONGO_URI=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

## Core Features

- Candidate registration and login
- Protected routes with role-based admin pages
- Drag and drop resume upload
- PDF and DOCX text extraction
- Job description paste input
- ATS score breakdown: keyword, skills, experience, formatting
- Matched skills, missing skills, strengths, weaknesses, and suggestions
- Candidate analysis history
- Admin user/report statistics
- Printable/downloadable analysis report
