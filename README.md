# FoodShare - Food Donation App for Andhra Pradesh Orphanages 🚀

## 🎯 Features
- ✅ Search orphanages by city/phone (24+ AP locations)
- ✅ Admin approval workflow (Orphanages & Users/Donors)
- ✅ Phone calls & share
- ✅ Donor/User registration (pending approval)
- ✅ MongoDB Atlas + Netlify/Render deploy

## 🛠️ Local Setup
```bash
cd backend
copy .env.example .env  # Add your DB_URI & JWT_SECRET
npm install
npm run seed           # Seed demo orphanages
npm start              # Backend: http://localhost:5000

# Frontend
# 1. Update script.js API_BASE = http://localhost:5000/api/orphanages
# 2. Open frontend/index.html
```

## ☁️ Render.com Backend Deploy (Critical Env Vars)
1. Fork repo → Render Dashboard → New Web Service → Connect GitHub
2. Build: `npm install` | Start: `npm start`
3. **Required Environment Variables** (Dashboard → Environment):
   ```
   DB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodshare?retryWrites=true&w=majority
   JWT_SECRET=your-secure-random-jwt-secret-here-min32chars-change-this
   ```
4. **render.yaml** auto-handles build/start.

**Frontend**: Push to GitHub → Netlify auto-deploys (update API_BASE in script.js).

## 🔑 Admin Login (Orphanage/User Manager)
```
Username: karthik
Password: SecureRandomPass123!
```
- View/approve pending orphanages & users in Admin Panel.

## 🧪 Test Flow
1. Submit Donor form → Check MongoDB Compass (users collection, status=pending)
2. Admin login → Pending Users tab → Approve
3. Users now `isApproved: true`

## 📊 API Endpoints
```
# Public
GET    /api/orphanages       - Approved orphanages
POST   /api/orphanages       - Submit new (pending)
POST   /api/users            - Register donor/user (pending)

# Admin (POST /api/orphanages/login first)
GET    /api/admin/orphanages/pending
GET    /api/admin/users/pending
PATCH  /api/admin/users/:id/approve
PATCH  /api/admin/users/:id/reject
```

## 🔧 Troubleshooting Render
- Logs: Render Dashboard → your-app → Logs
- Env vars saved? Restart service.
- MongoDB Network Access: Allow 0.0.0.0/0 or Render IP.
- Test: `curl https://your-app.onrender.com/api/orphanages`

**Live**: [https://foodshare-app-5l58.onrender.com](https://foodshare-app-5l58.onrender.com)
