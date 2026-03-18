# 🔗 LinkNest — AI-Powered Bookmark Manager

A modern, full-stack bookmark manager with AI-powered categorization built with React, Node.js, MongoDB, and OpenAI.

---

## ✨ Features

- **Two-Level Hierarchy**: Browser Source (Chrome, Firefox, Edge…) → AI Topic (AI, Dev, Design…)
- **AI Categorization**: GPT-4o-mini automatically categorizes bookmarks by topic
- **Bulk Import**: Upload HTML/JSON bookmark exports from any browser
- **JWT Auth**: Secure access + refresh token rotation
- **Rich Filtering**: Filter by browser, topic, favorites, tags, full-text search
- **Grid & List Views**: Flexible display with keyboard-friendly UX
- **Bulk Actions**: Select and delete multiple bookmarks

---

## 🗂️ Project Structure

```
linknest/
├── backend/          # Node.js + Express API
│   └── src/
│       ├── models/       # Mongoose schemas (User, Bookmark)
│       ├── routes/       # REST endpoints (auth, bookmarks)
│       ├── services/     # AI categorization (OpenAI)
│       ├── utils/        # Bookmark file parser
│       └── middleware/   # JWT auth
└── frontend/         # React 18 + Vite + Ant Design
    └── src/
        ├── api/          # Axios client + API functions
        ├── components/   # UI components
        ├── hooks/        # React Query hooks
        ├── pages/        # Auth, Dashboard
        ├── store/        # Zustand (auth, UI)
        ├── types/        # TypeScript interfaces
        └── utils/        # Helpers (colors, formatting)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (optional — falls back to rule-based)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, and OpenAI key
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Create .env.local if you need a custom API URL:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 3. Open in browser

Visit `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret for access tokens (change in prod!) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (change in prod!) |
| `OPENAI_API_KEY` | OpenAI key for AI categorization |
| `PORT` | API port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Bookmarks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookmarks` | List (with filters) |
| GET | `/api/bookmarks/stats` | Dashboard stats |
| POST | `/api/bookmarks` | Create bookmark |
| PATCH | `/api/bookmarks/:id` | Update bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |
| DELETE | `/api/bookmarks/bulk/delete` | Bulk delete |
| POST | `/api/bookmarks/import/file` | Import from file |
| POST | `/api/bookmarks/import/url` | Import single URL |

---

## 🤖 AI Categorization

When a bookmark is imported:
1. **With OpenAI key**: GPT-4o-mini classifies the title+URL into one of 15 topics
2. **Without key**: Falls back to URL/title pattern matching

Supported topics: AI · Development · Design · Learning · Finance · News · Social · Tools · Entertainment · Science · Health · Business · Productivity · Security · Other

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI Library | Ant Design 5 |
| State | Zustand (persist) |
| Data Fetching | React Query v5 + Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4o-mini |
| Auth | JWT (access + refresh) |

---

## 🛠️ Deployment

### Docker (recommended)

```bash
# Backend
docker build -t linknest-api ./backend
docker run -p 5000:5000 --env-file backend/.env linknest-api

# Frontend (build static)
cd frontend && npm run build
# Serve dist/ with nginx or any static host
```

### MongoDB Atlas
Set `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/linknest`

---

## 📝 License

MIT
