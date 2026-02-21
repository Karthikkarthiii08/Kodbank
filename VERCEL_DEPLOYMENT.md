# 🚀 Kodbank - Vercel Deployment Guide

## ✅ Fixed Issues

The 404 error has been resolved! Here's what was fixed:

1. ✅ Created `api/index.js` - Serverless function for Vercel
2. ✅ Updated `vercel.json` - Proper routing configuration
3. ✅ Updated frontend files - Dynamic API URL detection
4. ✅ Added root `package.json` - Dependencies for Vercel

---

## 📋 Deployment Steps

### Step 1: Push Updated Code to GitHub

```bash
cd kodbank
git add .
git commit -m "Fix: Vercel deployment configuration"
git push origin main
```

### Step 2: Redeploy on Vercel

1. Go to your Vercel dashboard
2. Click on your Kodbank project
3. Click "Redeploy" or it will auto-deploy from GitHub

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

⚠️ **Important:** 
- Use your actual database credentials from Aiven
- After adding environment variables, you MUST redeploy!
- Never commit these values to GitHub

---

## 🌐 File Structure for Vercel

```
kodbank/
├── api/
│   └── index.js          # Serverless API (handles /api/* routes)
├── frontend/
│   ├── index.html        # Landing page
│   ├── register.html     # Registration
│   ├── login.html        # Login
│   ├── dashboard.html    # Dashboard
│   └── styles.css        # Styles
├── backend/
│   └── db.js            # Database connection (used by api/index.js)
├── vercel.json          # Vercel configuration
└── package.json         # Root dependencies
```

---

## 🔧 How It Works

### API Routes (Serverless)
- `/api/register` → Register new user
- `/api/login` → Login user
- `/api/balance` → Get user balance
- `/api/health` → Health check

### Frontend Routes (Static)
- `/` → Landing page (index.html)
- `/register.html` → Registration page
- `/login.html` → Login page
- `/dashboard.html` → Dashboard

### Dynamic API URL Detection
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'  // Local development
  : '';                       // Production (same origin)
```

---

## ✅ Testing After Deployment

### 1. Test Landing Page
Visit: `https://your-app.vercel.app`
- Should see glassmorphic welcome page
- Two buttons: "Create Account" and "Sign In"

### 2. Test API Health
Visit: `https://your-app.vercel.app/api/health`
- Should return: `{"status":"ok","message":"Kodbank API is running"}`

### 3. Test Registration
1. Click "Create Account"
2. Fill in details
3. Submit
4. Should redirect to login

### 4. Test Login
1. Enter credentials
2. Click "Sign In"
3. Should redirect to dashboard

### 5. Test Balance Check
1. Click "🎉 Check My Balance"
2. Should see balance with confetti animation

---

## 🐛 Troubleshooting

### Issue: Still Getting 404
**Solution:**
1. Make sure you pushed the latest code
2. Redeploy on Vercel
3. Clear browser cache (Ctrl + Shift + R)

### Issue: API Not Working
**Solution:**
1. Check environment variables in Vercel
2. Make sure all variables are set
3. Redeploy after adding variables

### Issue: Database Connection Failed
**Solution:**
1. Verify database credentials
2. Check if Aiven database is running
3. Test connection from local first

### Issue: CORS Errors
**Solution:**
- Already handled in `api/index.js` with:
```javascript
app.use(cors({ 
  origin: true, 
  credentials: true 
}));
```

---

## 📊 Vercel Configuration Explained

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"  // Serverless function
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"  // API routes
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"   // Static files
    }
  ]
}
```

---

## 🎯 What Changed

### Before (Not Working)
- ❌ Backend server.js trying to run as always-on server
- ❌ Vercel doesn't support always-on Node servers
- ❌ Frontend couldn't find backend

### After (Working)
- ✅ API as serverless function (`api/index.js`)
- ✅ Frontend as static files
- ✅ Dynamic API URL detection
- ✅ Proper routing in vercel.json

---

## 🔐 Security Notes

### Environment Variables
- Never commit `.env` file
- Always use Vercel's environment variables
- Rotate JWT_SECRET in production

### Database
- Using SSL connection
- Password hashing with bcrypt
- JWT token expiration (24h)

---

## 📱 Local Development

Still works the same way:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

Visit: http://localhost:8080

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Landing page loads
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard shows
- [ ] Balance check works
- [ ] Confetti animation plays
- [ ] Logout works

---

## 📞 Support

If issues persist:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Test API endpoints directly
4. Verify environment variables

---

**Deployment Date:** February 20, 2026
**Status:** ✅ Ready for Production
