<div align="center">
  <img src="frontend/public/logo.png" alt="LinkNest Logo" width="120" />

  <h1>LinkNest</h1>
  <p><strong>AI-Powered Bookmark Manager</strong></p>
  <p>Import from any browser · AI auto-categorizes everything · Explore with a Kanban board</p>

  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript" />
    <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js" />
    <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb" />
<img src="https://img.shields.io/badge/Groq-Llama--3--8B-FF6B35?style=flat-square&logo=groq" />
    <img src="https://img.shields.io/badge/Ant%20Design-5.12-0170FE?style=flat-square&logo=antdesign" />
  </p>
</div>

---

## 🌐 Live Demo

👉 https://linknest-ai-bookmarkmanager.netlify.app

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [AI Integration](#ai-integration)
- [State Management](#state-management)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

LinkNest is a full-stack, SaaS-style bookmark manager that uses AI to automatically organize your saved links. Import from Chrome, Firefox, Edge, Brave, or Safari — GPT-4o-mini reads every URL and categorizes it into one of 15 topics instantly.

The UI is built around a **3-level Kanban board**:

```
Level 1  →  Browser columns   (Chrome | Firefox | Edge …)
Level 2  →  Topic columns     (AI | Development | Design …)
Level 3  →  Focused grid      (filtered list with sort + bulk actions)
```

Drag and drop cards between columns to re-categorize. Everything is dark/light mode aware.

---

## Features

| Feature | Description |
|---|---|
| 🤖 **AI Categorization** | Groq AI(Llama-3) auto-generates title, description, tags and topic for every bookmark |
| 📥 **Browser Import** | Upload HTML/JSON exports from Chrome, Firefox, Edge, Brave, Safari |
| 🗂️ **3-Level Kanban** | Browser → Topic → Grid navigation with drag-and-drop |
| 🔍 **Full-Text Search** | MongoDB text index across title, URL, description, tags |
| 🌙 **Dark / Light Theme** | Persistent theme via Redux, Ant Design darkAlgorithm |
| 🔐 **JWT Auth** | Access + refresh token rotation, multi-device support |
| ⭐ **Favorites & Archive** | Quick access to starred and archived bookmarks |
| 🏷️ **Tags** | AI-generated or manual |
| 📊 **Stats** | Browser and topic breakdowns with live counts |
| 🔁 **Drag & Drop** | @dnd-kit — move bookmarks between columns to re-categorize |
| 📱 **Responsive** | Works on desktop and mobile |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| TypeScript | 5.2 | Type safety |
| Vite | 5.0 | Build tool + dev server |
| Ant Design | 5.12 | UI component library |
| Redux Toolkit | 2.1 | Global state (auth + UI) |
| RTK Query | 2.1 | Auth API calls (login, register, logout) |
| React Query | 5.13 | Bookmark data fetching + caching |
| Axios | 1.6 | HTTP client with JWT interceptor |
| Redux Persist | 6.0 | Persist auth tokens + theme preference |
| @dnd-kit/core | 6.1 | Drag and drop |
| React Router | 6.21 | Client-side routing |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Express | 4.18 | HTTP server |
| MongoDB | 7 | Database |
| Mongoose | 8.0 | ODM + schema validation |
| OpenAI SDK | 4.20 | GPT-4o-mini integration |
| JWT (jsonwebtoken) | 9.0 | Access + refresh tokens |
| bcryptjs | 2.4 | Password hashing |
| Joi | 17.11 | Request body validation |
| Helmet | 7.1 | Security headers |
| express-rate-limit | 7.1 | Rate limiting |
| Multer | 1.4 | File upload handling |
| Morgan | 1.10 | HTTP request logging |

---

## Project Structure

```
linknest/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT verify middleware
│   │   ├── models/
│   │   │   ├── User.js              # User schema + bcrypt + JWT methods
│   │   │   └── Bookmark.js          # Bookmark schema + indexes
│   │   ├── routes/
│   │   │   ├── auth.js              # /api/auth/*
│   │   │   └── bookmarks.js         # /api/bookmarks/*
│   │   ├── services/
│   │   │   └── aiService.js         # OpenAI categorization + fallback
│   │   ├── utils/
│   │   │   └── parseBookmarks.js    # HTML/JSON browser export parser
│   │   └── index.js                 # Express app entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── logo.png
│   │   ├── dark.png
│   │   └── empty.png
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance + JWT refresh interceptor
│   │   │   └── index.ts             # Centralized API functions
│   │   │
│   │   ├── components/
│   │   │   ├── BookmarkCard/        # Bookmark card (grid/list variants)
│   │   │   ├── BookmarkForm/        # Reusable form (create | edit | AI modes)
│   │   │   ├── CategorySidebar/     # Sidebar navigation (browser/topic filters)
│   │   │   ├── EditModal/           # Edit bookmark modal
│   │   │   ├── EmptyState/          # Empty state UI (illustrations/messages)
│   │   │   ├── ImportModal/         # File import + URL AI import + manual entry
│   │   │   └── KanbanBoard/
│   │   │       ├── index.tsx        # 3-level board logic + DnD context
│   │   │       ├── KanbanColumn.tsx # Droppable column
│   │   │       └── KanbanCard.tsx   # Draggable card
│   │   │
│   │   ├── hooks/
│   │   │   └── useBookmarks.ts      # React Query hooks for bookmark operations
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing/             # Public landing page
│   │   │   ├── Auth/                # Authentication (login/register)
│   │   │   └── Dashboard/           # Main application shell
│   │   │
│   │   ├── store/
│   │   │   ├── index.ts             # configureStore + redux-persist setup
│   │   │   ├── authSlice.ts         # Auth state + matchers
│   │   │   ├── authApiSlice.ts      # RTK Query endpoints (auth APIs)
│   │   │   ├── uiSlice.ts           # UI state (filters, theme, modals, selection)
│   │   │   └── hooks.ts             # Typed hooks (useAppDispatch, useAppSelector)
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css          # Global styles + CSS variables (light/dark)
│   │   │   └── theme.ts             # Ant Design theme configuration
│   │   │
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types & interfaces
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.ts           # Utility functions (colors, emoji, date, favicon)
│   │   │
│   │   ├── App.tsx                  # App root (Router + Providers)
│   │   ├── main.tsx                 # React entry point
│   │   └── vite-env.d.ts
│   │
│   ├── Dockerfile                   # Frontend container config
│   ├── nginx.conf                   # Nginx config for production build
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                         # Express backend (API + DB logic)
│
├── docker-compose.yml              # Multi-container setup
├── DEPLOYMENT.md                   # Deployment guide
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** running locally or a MongoDB Atlas URI
- **OpenAI API key** (optional — falls back to rule-based categorization)

### 1. Clone the repository

```bash
git clone https://github.com/yourname/linknest.git
cd linknest
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values (see [Environment Variables](#environment-variables)).

```bash
npm run dev
# Server starts on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

### 4. Open in browser

Visit `http://localhost:5173`

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically — no extra config needed.

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/linknest

# JWT — use long random strings, must be DIFFERENT from each other
JWT_ACCESS_SECRET=your_64_char_random_hex_here
JWT_REFRESH_SECRET=your_other_64_char_random_hex_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# OpenAI — optional, falls back to rule-based if not set
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx

# CORS — your frontend URL
CLIENT_URL=http://localhost:5173
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend

No `.env` file needed in development. Vite's proxy handles the API.

For production with a separate domain:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns tokens |
| POST | `/api/auth/refresh` | — | Rotate refresh token |
| POST | `/api/auth/logout` | ✅ | Invalidate refresh token |
| GET | `/api/auth/me` | ✅ | Get current user |
| PATCH | `/api/auth/me` | ✅ | Update profile |

### Bookmarks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/bookmarks` | ✅ | List with filters + pagination |
| GET | `/api/bookmarks/stats` | ✅ | Dashboard statistics |
| GET | `/api/bookmarks/grouped` | ✅ | Kanban grouped data |
| GET | `/api/bookmarks/:id` | ✅ | Get single bookmark |
| POST | `/api/bookmarks` | ✅ | Create (AI categorizes if no topic given) |
| PATCH | `/api/bookmarks/:id` | ✅ | Update |
| DELETE | `/api/bookmarks/:id` | ✅ | Delete |
| DELETE | `/api/bookmarks/bulk/delete` | ✅ | Bulk delete |
| POST | `/api/bookmarks/import/file` | ✅ | Import HTML/JSON browser export |
| POST | `/api/bookmarks/import/url` | ✅ | Import single URL with full AI analysis |
| POST | `/api/bookmarks/:id/visit` | ✅ | Track visit count |

### Query Parameters for `GET /api/bookmarks`

| Param | Type | Example |
|---|---|---|
| `browserSource` | string | `Chrome` |
| `topicCategory` | string | `Development` |
| `isFavorite` | boolean | `true` |
| `isArchived` | boolean | `false` |
| `search` | string | `react hooks` |
| `sortBy` | string | `createdAt`, `title`, `visitCount` |
| `sortOrder` | string | `asc`, `desc` |
| `page` | number | `1` |
| `limit` | number | `24` |

---

## Architecture

### Request Flow — Adding a Bookmark

```
User fills form → clicks "Add Bookmark"
        │
        ▼
BookmarkForm validates (Ant Design rules + custom URL validator)
        │
        ▼
useCreateBookmark() → POST /api/bookmarks
        │
        ▼
Express → Joi validates body
        │
        ├── topicCategory provided? → skip AI
        │
        └── not provided? → analyzeBookmark(url, title)
                    │
                    ▼
                GPT-4o-mini returns:
                { title, description, tags, topicCategory, confidence }
                    │
                    ▼
            Bookmark.create({ ...data, aiCategorized: true, aiConfidence: 0.94 })
                    │
                    ▼
React Query invalidates ['bookmarks'] cache → Kanban re-fetches
```

### JWT Refresh Flow

```
API returns 401 { code: 'TOKEN_EXPIRED' }
        │
Axios interceptor catches it
        │
isRefreshing flag set — queues parallel requests
        │
POST /api/auth/refresh { refreshToken }
        │
Server: validates token exists in DB array → rotates it
        │
New accessToken + refreshToken returned
        │
Interceptor replays all queued requests with new token
        │
If refresh also fails → clearAuth() → redirect /login
```

### Kanban 3-Level Navigation

| `browserSource` | `topicCategory` | View |
|---|---|---|
| `all` | `all` | Kanban — Browser columns |
| `Chrome` | `all` | Kanban — Topic columns inside Chrome |
| `Chrome` | `Development` | Focused grid — Chrome + Dev bookmarks |
| `all` | `Design` | Kanban — Browser columns filtered to Design only |

---

## AI Integration

### How it works

When a bookmark is added or imported, `aiService.js` calls OpenAI:

```js
// Single URL — full analysis
analyzeBookmark(url, title)
// Returns: title, description, tags[], topicCategory, confidence

// Bulk import — batch of 20 per call (efficient)
batchCategorizeBookmarks(bookmarks[])
// Returns: [{ category, confidence }]
```

### Fallback chain

```
1. Groq-AI(Llama)  → full AI analysis
2. Rule-based      → URL/title pattern matching (75+ patterns)
3. Default         → category = 'Other', confidence = 0.5
```

The `aiCategorized` and `aiConfidence` fields on every bookmark record which path was used.

### Supported topics

`AI` · `Development` · `Design` · `Learning` · `Finance` · `News` · `Social` · `Tools` · `Entertainment` · `Science` · `Health` · `Business` · `Productivity` · `Security` · `Other`

---

## State Management

Two layers work together:

```
Redux Store
├── authSlice         — user, tokens, isAuthenticated (persisted)
│   └── listens to authApiSlice via addMatcher
├── uiSlice           — filters, theme, selectedIds, modals (theme persisted)
└── authApiSlice      — RTK Query: login, register, logout, getMe (not persisted)

React Query (separate)
└── bookmark data     — list, grouped, stats, mutations (cache invalidation)
```

**Why two state libraries?**
- RTK Query for **auth** — needs to live in Redux because auth state is read by route guards, axios interceptors, and persisted across sessions
- React Query for **bookmarks** — better DX for paginated data, per-filter cache keys, background refetch

---

## BookmarkForm — Reusable Form Pattern

One form component handles three modes:

```tsx
<BookmarkForm mode="create" />                           // empty form
<BookmarkForm mode="edit" initialValues={bookmark} />   // pre-filled, save disabled until changed
<BookmarkForm mode="ai" initialValues={aiData} />       // AI pre-filled, URL locked
```

The `canSubmit` logic:
- **create** — enabled when form is valid
- **edit** — enabled only when something actually changed (deep comparison including tag arrays)
- **ai** — enabled when form is valid (fields may be edited before saving)

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions covering:

- Docker Compose (recommended)
- Manual VPS with PM2 + Nginx + Certbot SSL
- Railway (backend) + Vercel (frontend)
- MongoDB Atlas setup

---

## Scripts

### Backend

```bash
npm run dev     # nodemon watch mode

```

### Frontend

```bash
npm run dev     # Vite dev server with HMR
npm run build   # TypeScript check + Vite build 

```

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to:
- Use
- Modify
- Distribute

With proper attribution.

---

<div align="center">
  <p>Built with ❤️ using React, Node.js, MongoDB, and GroqAI</p>
  <p>
    <a href="./DEPLOYMENT.md">Deployment Guide</a> ·
    <a href="https://ant.design">Ant Design</a> ·
    <a href="https://grok.com/">OpenAI</a>
  </p>
</div>
