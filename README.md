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
    <img src="https://img.shields.io/badge/RTK%20Query-2.1-764ABC?style=flat-square&logo=redux" />
  </p>
</div>

---

## 🌐 Live Demo

👉 https://linknest-ai-bookmarkmanager.netlify.app

---

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
- [BookmarkForm Pattern](#bookmarkform--reusable-form-pattern)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

LinkNest is a full-stack, SaaS-style bookmark manager that uses AI to automatically organize your saved links. Import from Chrome, Firefox, Edge, Brave, or Safari — Groq AI (Llama-3-8B) reads every URL and categorizes it into one of 15 topics instantly.

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
| 🤖 **AI Categorization** | Groq AI (Llama-3) auto-generates title, description, tags and topic for every bookmark |
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
| RTK Query | 2.1 | All API calls (auth + bookmarks) |
| Redux Persist | 6.0 | Persist auth tokens + theme preference |
| @dnd-kit/core | 6.1 | Drag and drop Kanban |
| React Router | 6.21 | Client-side routing |
| Axios | 1.6 | HTTP client (auth routes only) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Express | 4.18 | HTTP server |
| MongoDB | 7 | Database |
| Mongoose | 8.0 | ODM + schema validation |
| Groq SDK | — | Llama-3 AI integration |
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
│   │   │   └── Bookmark.js          # Bookmark schema + compound indexes
│   │   ├── routes/
│   │   │   ├── auth.js              # /api/auth/*
│   │   │   └── bookmarks.js         # /api/bookmarks/*
│   │   ├── services/
│   │   │   └── aiService.js         # Groq AI categorization + rule-based fallback
│   │   ├── utils/
│   │   │   └── parseBookmarks.js    # HTML/JSON browser export parser
│   │   └── index.js                 # Express app entry point
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── logo.png                 # App logo
│   │   ├── dark.png                 # Dark mode illustration
│   │   └── empty.png                # Empty state illustration
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── baseQuery.ts         # RTK Query base + token refresh middleware
│   │   │   ├── client.ts            # Axios instance (auth routes only)
│   │   │   └── index.ts             # authApi functions
│   │   │
│   │   ├── app/
│   │   │   ├── AppProviders.tsx     # Redux + Query providers
│   │   │   ├── AppRouter.tsx        # Route definitions
│   │   │   └── AppTheme.tsx         # Ant Design ConfigProvider
│   │   │
│   │   ├── components/
│   │   │   ├── BookmarkForm/        # Reusable form (create | edit | AI modes)
│   │   │   ├── CategorySidebar/
│   │   │   │   ├── index.tsx        # Sidebar shell
│   │   │   │   ├── SidebarBrowseTopicsList.tsx
│   │   │   │   ├── SidebarItem.tsx
│   │   │   │   └── SidebarMainNav.tsx
│   │   │   ├── EditModal/           # Edit bookmark modal
│   │   │   ├── EmptyState/          # Empty state UI
│   │   │   ├── ImportModal/         # File import + URL AI import + manual entry
│   │   │   └── KanbanBoard/
│   │   │       ├── index.tsx        # 3-level board logic + DnD context
│   │   │       ├── KanbanCard.tsx   # Draggable card
│   │   │       └── KanbanColumn.tsx # Droppable column
│   │   │
│   │   ├── hooks/
│   │   │   └── useBookmarks.ts      # RTK Query wrapper hooks (friendly API)
│   │   │
│   │   ├── pages/
│   │   │   ├── Auth/                # Login + register
│   │   │   ├── Dashboard/           # Main application shell
│   │   │   └── Landing/             # Public landing page
│   │   │
│   │   ├── store/
│   │   │   ├── index.ts             # configureStore + redux-persist
│   │   │   ├── authSlice.ts         # Auth state + addMatcher listeners
│   │   │   ├── authApiSlice.ts      # RTK Query: login, register, logout, getMe
│   │   │   ├── bookmarksApiSlice.ts # RTK Query: all bookmark endpoints
│   │   │   ├── uiSlice.ts           # Filters, theme, modals, selection state
│   │   │   └── hooks.ts             # useAppDispatch + useAppSelector (typed)
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css          # CSS variables (light/dark tokens)
│   │   │   └── theme.ts             # Ant Design lightTheme + darkTheme configs
│   │   │
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces + enums
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.ts           # Colors, emojis, date format, favicon URL
│   │   │
│   │   ├── App.tsx                  # App root (Router + ConfigProvider)
│   │   ├── main.tsx                 # React entry point
│   │   └── vite-env.d.ts            # Vite env type declarations
│   │
│   ├── Dockerfile
│   ├── nginx.conf                   # Nginx SPA + API proxy config
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── DEPLOYMENT.md
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** running locally or a MongoDB Atlas URI
- **Groq API key** — free at [console.groq.com](https://console.groq.com)

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

Edit `backend/.env` — see [Environment Variables](#environment-variables).

```bash
npm run dev
# API starts on http://localhost:5000
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

Vite proxies `/api` → `http://localhost:5000` automatically. No extra config needed.

---

## Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/linknest

# JWT — generate two DIFFERENT 64-char random strings
JWT_ACCESS_SECRET=your_64_char_random_hex_here
JWT_REFRESH_SECRET=your_other_64_char_random_hex_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Groq AI — free at console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# CORS — must match your frontend URL exactly
CLIENT_URL=http://localhost:5173
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend (`.env` — only needed for production)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

> In development, Vite's proxy handles this automatically — no `.env` needed.

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
| GET | `/api/bookmarks/:id` | ✅ | Single bookmark |
| POST | `/api/bookmarks` | ✅ | Create (AI categorizes if no topic given) |
| PATCH | `/api/bookmarks/:id` | ✅ | Update |
| DELETE | `/api/bookmarks/:id` | ✅ | Delete |
| DELETE | `/api/bookmarks/bulk/delete` | ✅ | Bulk delete |
| POST | `/api/bookmarks/import/file` | ✅ | Import HTML/JSON browser export |
| POST | `/api/bookmarks/import/url` | ✅ | Import single URL with full AI analysis |
| POST | `/api/bookmarks/:id/visit` | ✅ | Track visit count |

### Query Parameters — `GET /api/bookmarks`

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
User fills form → clicks "Save Bookmark"
        │
        ▼
BookmarkForm validates (Ant Design rules + custom URL validator)
canSubmit = valid + (create: URL filled) / (edit: something changed)
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
                Groq Llama-3 returns:
                { title, description, tags, topicCategory, confidence }
                    │
                    ▼
            Bookmark.create({ ...data, aiCategorized: true, aiConfidence: 0.94 })
                    │
                    ▼
RTK Query invalidates tags → Kanban + sidebar counts refetch automatically
```

### JWT Refresh Flow (baseQuery.ts)

```
RTK Query fires any request
        │
API returns 401 { code: 'TOKEN_EXPIRED' }
        │
baseQueryWithReauth catches it
        │
Mutex check: isRefreshing flag prevents parallel refresh storms
        │
fetch('/auth/refresh') with stored refreshToken
        │
Success → setTokens() dispatched → localStorage updated
        │
Original request retried with new token
        │
All queued requests resolve
        │
Refresh fails → clearAuth() → redirect /login
```

### Kanban 3-Level Navigation

| `browserSource` | `topicCategory` | View |
|---|---|---|
| `all` | `all` | Kanban — Browser columns |
| `Chrome` | `all` | Kanban — Topic columns inside Chrome |
| `Chrome` | `Development` | Focused grid — sorted list + bulk actions |
| `all` | `Design` | Kanban — Browser columns filtered to Design only |

---

## AI Integration

### How it works

```js
// Single URL — full enrichment
analyzeBookmark(url, title)
// Returns: { title, description, tags[], topicCategory, confidence }

// Bulk file import — 20 bookmarks per API call
batchCategorizeBookmarks(bookmarks[])
// Returns: [{ category, confidence }]
```

### Fallback chain

```
1. Groq AI (Llama-3-8B)  → full AI analysis
2. Rule-based             → 75+ URL/title patterns across 14 categories
3. Default                → category = 'Other', confidence = 0.5
```

The `aiCategorized` (boolean) and `aiConfidence` (0–1) fields on every bookmark record which path was used. Users see an **AI badge** on cards categorized by the model.

### Supported topics

`AI` · `Development` · `Design` · `Learning` · `Finance` · `News` · `Social` · `Tools` · `Entertainment` · `Science` · `Health` · `Business` · `Productivity` · `Security` · `Other`

---

## State Management

### Architecture

```
Redux Store
├── authSlice              — user, tokens, isAuthenticated  (persisted to localStorage)
│   └── addMatcher         — syncs from authApiSlice events
├── uiSlice                — filters, theme, selectedIds, modals  (theme persisted)
├── authApiSlice           — RTK Query: login, register, logout, getMe
└── bookmarksApiSlice      — RTK Query: all 11 bookmark endpoints
    └── cache tags:  Bookmark | BookmarkList | BookmarkStats | BookmarkGrouped
```

### Why RTK Query for everything (no React Query)

All data fetching — both auth and bookmarks — is now handled by RTK Query:

- **`authApiSlice`** — login, register, logout, getMe with `addMatcher` syncing state into `authSlice`
- **`bookmarksApiSlice`** — all bookmark CRUD + import + kanban grouped, with automatic cache invalidation via tag system
- **`baseQuery.ts`** — custom `baseQueryWithReauth` replaces the old axios interceptor, handles token refresh with a mutex to prevent parallel refresh storms

### Cache invalidation

```
useCreateBookmarkMutation succeeds
        │
invalidatesTags: ['BookmarkList', 'BookmarkStats', 'BookmarkGrouped']
        │
RTK automatically refetches:
  useGetBookmarksQuery()  → card grid updates
  useGetStatsQuery()      → sidebar counts update
  useGetGroupedQuery()    → kanban columns update
```

No manual `invalidateQueries` needed anywhere.

---

## BookmarkForm — Reusable Form Pattern

One component handles three modes:

```tsx
<BookmarkForm mode="create" />
// Empty form. Save enabled when valid.

<BookmarkForm mode="edit" initialValues={bookmark} />
// Pre-filled. Save disabled until something actually changes (deep comparison).

<BookmarkForm mode="ai" initialValues={aiData} />
// AI pre-filled. URL field locked. Shows "AI" badge on enriched fields.
```

**`canSubmit` logic:**
- `create` — form passes all validation rules
- `edit` — form is valid AND at least one field differs from `initialValues` (arrays compared element-by-element)
- `ai` — form is valid (user may edit any field before saving)

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full step-by-step instructions:

- **Docker Compose** — single command, runs everything
- **Manual VPS** — PM2 + Nginx + Certbot SSL
- **Railway + Vercel** — free cloud deployment in 10 minutes
- **MongoDB Atlas** — free managed database

---

## Scripts

### Backend

```bash
npm run dev     # nodemon watch mode
npm start       # production
```

### Frontend

```bash
npm run dev     # Vite dev server with HMR
npm run build   # TypeScript check + production build → dist/
npm run preview # Preview production build locally
npm run lint    # ESLint
```

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute with proper attribution.

---

<div align="center">
  <p>Built with ❤️ using React, Node.js, MongoDB, and Groq AI</p>
  <p>
    <a href="./DEPLOYMENT.md">Deployment Guide</a> ·
    <a href="https://ant.design">Ant Design</a> ·
    <a href="https://console.groq.com">Groq AI</a>
  </p>
</div>
