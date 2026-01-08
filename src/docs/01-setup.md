# ⚙️ Setup & Run — **React Admin Panel (Frontend)**

This document explains how to run the project locally **without any external help**.

---

## 🧩 Node Version
- ✅ Required: **Node.js >= 20**
- ⭐ Recommended: **Node.js 22 LTS**

Check your Node version:
```bash
node -v
```

---

## 📦 Package Manager
This project uses **npm**.

Check npm version:
```bash
npm -v
```

---

## 📥 Install Dependencies
From the project root directory:
```bash
npm install
```

---

## 🔐 Environment Variables
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=local
```

### 📝 Environment Variables Explanation
- 🌐 `VITE_API_BASE_URL` — Backend API base URL
- 🧪 `VITE_APP_ENV` — Current environment (`local` / `staging` / `production`)

> ⚠️ **Important**: Since this project uses **Vite**, all environment variables **must start with `VITE_`**.

---

## 🚀 Run in Development (dev)
Starts the development server with hot reload:
```bash
npm start
```

### 🌍 Default Local URL
- http://localhost:5173

---

## 🏗️ Build for Production
Creates an optimized production build:
```bash
npm run build
```

---

## 🔍 Preview Production Build
Runs the production build locally:
```bash
npm run preview
```

Use this command to verify **production behavior** before deployment.

---

## 🧯 Common Issues & Solutions

### ❌ API Not Reachable / Network Error
**Symptoms:** Empty screens or failed network requests

**Solutions:**
- Verify `VITE_API_BASE_URL`
- Test API manually using Swagger

---

### 🌐 CORS Error
**Symptoms:** Browser console shows CORS policy errors

**Solutions:**
- Backend must allow frontend origin
- Ensure the correct API domain is used

---

### 📄 Blank Page After Deployment
**Symptoms:** Refreshing routes like `/users` returns 404

**Solutions:**
- Configure hosting for SPA fallback
- Redirect all routes to `index.html`

---

### 🔐 401 Unauthorized Errors
**Symptoms:** Requests fail with 401 status

**Solutions:**
- Confirm token is stored correctly
- Verify login API response
- Ensure Axios interceptor attaches the token

---

### 🔄 Environment Variables Not Updating
**Symptoms:** App still uses old environment values

**Solutions:**
- Restart the dev server after updating `.env`
```bash
Ctrl + C
npm start
```
- Confirm `.env` file location

---

## 🛠️ Useful Commands
- ▶️ Start development server: `npm start`
- 🏗️ Build for production: `npm run build`
- 🔍 Preview production build: `npm run preview`
- 🧹 Lint (if configured): `npm run lint`

