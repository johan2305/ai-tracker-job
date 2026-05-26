# AI Tracker Job 🚀

AI Tracker Job is a fullstack web application that helps users manage and track job applications with AI-powered tools.

Built with FastAPI + React + Gemini AI.

---

# ✨ Features

- 🔐 JWT Authentication
- 📋 Track job applications
- 🧠 AI-generated cover letters
- 📝 Notes and interview tracking
- 📊 Application status management
- 🎨 Modern responsive dashboard
- ⚡ FastAPI backend
- ⚛️ React frontend

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Axios

## Backend
- FastAPI
- Python
- JWT Authentication

## AI
- Gemini API

## Database
- SQLite

---

# 🚀 Installation

## Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend

```bash
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside backend:

```env
GEMINI_API_KEY=your_api_key
```

---

# 📸 Screenshots

(Add screenshots here)

---

# 👨‍💻 Author

Johan Belalcazar

---

# 🌐 Future Improvements

- Resume scoring with AI
- PDF export
- Multi-user collaboration
- AI interview preparation
- Analytics dashboard

# ✨ Features

# 👤 User Access

Users can create an account and log into the platform using JWT authentication.

### Register
Create a new account from the registration page.

### Login
Log in securely using email and password authentication.

### Demo Flow
1. Register a new account
2. Login
3. Add job applications
4. Track application status
5. Generate AI-powered cover letters

# 🚀 Installation

# ▶️ Running the Project

## Start Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

# 🔑 Demo Account

If registration is unavailable during deployment, use the demo account below:

```text
Email: johan2@test.com
Password: 123456
```