# Quick Start Deployment Checklist

## 🚀 Deploy to Vercel in 10 Minutes

### 1. Push to GitHub ✓
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy Backend ✓
1. Go to https://vercel.com
2. "Add New" → "Project" → Import `HackUTD25`
3. Root Directory: `backend`
4. Add environment variables from `backend/.env.example`
5. Deploy → Copy URL

### 3. Deploy Frontend ✓
1. "Add New" → "Project" → Import `HackUTD25` again
2. Root Directory: `frontend`
3. Add environment variables from `frontend/.env.example`
4. Update `VITE_API_URL` with backend URL from step 2
5. Deploy

### 4. Update URLs ✓
- Update `frontend/vercel.json` with actual backend URL
- Redeploy frontend

### 5. Test 🎉
Visit your frontend URL and test all features!

---

## Environment Variables Needed

### Backend (Vercel Dashboard)
```
NODE_ENV=production
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### Frontend (Vercel Dashboard)
```
VITE_API_URL=https://your-backend.vercel.app
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## Python Scraper (Later)
For now, keep it running locally or skip Reddit features until you set up a scheduled job.

See full guide: `DEPLOYMENT_GUIDE.md`
