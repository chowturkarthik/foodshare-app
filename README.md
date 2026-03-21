# FoodShare - Food Donation App for Andhra Pradesh Orphanages 🚀

## 🎯 Features
- ✅ Search orphanages by city/phone (24+ AP locations)
- ✅ Admin approval workflow  
- ✅ Phone calls & share
- ✅ Donor registration
- ✅ MongoDB Atlas + Netlify/Render deploy

## 🛠️ Local Setup
```bash
cd backend
npm install
npm run seed  # Seed 24 orphanages
npm start     # http://localhost:5000

# Frontend - open frontend/index.html
```

## ☁️ Production Deploy
1. **Backend**: [Render.com](https://render.com/new) → Web Service → GitHub repo → `backend/` → `render.yaml`
2. **Frontend**: Connected to Netlify (auto-deploy on push)
3. **Update**: `frontend/script.js` API_BASE = `https://your-render-app.onrender.com/api/orphanages`

## 🔑 Admin Login
```
Username: karthik
Password: SecureRandomPass123!
```

## 📊 API Endpoints
```
GET /api/orphanages - Public orphanages
POST /api/orphanages - Submit new
POST /api/orphanages/login - Admin login
/api/admin/* - Admin routes (auth required)
```

**Live Demo**: [Netlify Frontend](https://your-app.netlify.app) + [Render Backend](https://your-app.onrender.com)
