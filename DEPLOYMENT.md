# 🚀 Deployment Guide — LinkNest (Railway + Netlify)

This guide explains how to deploy LinkNest using:

* ⚙️ **Railway** → Backend (Node.js + Express)
* 🌐 **Netlify** → Frontend (React + Vite)

---

## 📦 Architecture Overview

```
Frontend (Netlify)
        ↓
   API Calls
        ↓
Backend (Railway)
        ↓
   Database (MongoDB Atlas / etc.)
```

---

## ☁️ Backend Deployment (Railway)

### 🚀 Step 1: Deploy to Railway

1. Go to Railway
2. Click **"New Project" → "Deploy from GitHub"**
3. Select your repository
4. Set **Root Directory** → `backend`

---

### ⚙️ Step 2: Environment Variables

Add the following in Railway:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLIENT_URL=https://your-netlify-app.netlify.app
```

---

### 🌐 Step 3: Get Backend URL

After deployment, Railway provides a URL:

```
https://your-app.up.railway.app
```

Your API base will be:

```
https://your-app.up.railway.app/api
```

---

### ⚠️ Important Backend Config

Ensure your Express app has:

```ts
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

---

## 🌍 Frontend Deployment (Netlify)

### 🚀 Step 1: Deploy to Netlify

1. Go to Netlify
2. Click **"Add new site" → "Import from Git"**
3. Select your repository
4. Set:

```
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

---

### ⚙️ Step 2: Environment Variables

Add in Netlify:

```env
VITE_API_URL=https://your-app.up.railway.app/api
```

---

### 🔁 Step 3: Redirects (Important for React Router)

Create a file:

```
frontend/public/_redirects
```

Add:

```
/*    /index.html   200
```

---

## 🔗 Connecting Frontend & Backend

In your frontend (`api/client.ts`):

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

---

## 🔐 Security Best Practices

* Never expose secrets in frontend
* Use `.env` for all configs
* Enable CORS only for your frontend domain
* Use HTTPS (default on Railway + Netlify)

---

## 🐞 Troubleshooting

### ❌ CORS Error

* Check `CLIENT_URL` in Railway
* Ensure exact Netlify URL (no trailing `/`)

---

### ❌ API Not Working

* Check `VITE_API_URL`
* Confirm backend is running on Railway

---

### ❌ Refresh Issue (404 on Netlify)

* Ensure `_redirects` file exists

---

### ❌ Environment Variables Not Working

* Restart deployment after adding env vars

---

## ✅ Final Checklist

* [ ] Backend deployed on Railway
* [ ] Frontend deployed on Netlify
* [ ] Environment variables configured
* [ ] CORS configured correctly
* [ ] API connected successfully

---

## 🎯 Deployment Summary

| Service | Role             |
| ------- | ---------------- |
| Railway | Backend API      |
| Netlify | Frontend Hosting |

---

🔥 Your LinkNest app is now live and production-ready!
