# Vercel Deployment Guide for HackUTD25

## Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com with GitHub)
3. Firebase project credentials
4. Reddit API credentials (if using scraper)

## Step 1: Prepare Your Repository

### Push to GitHub
```bash
# If not already initialized
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/toosh-legacy/HackUTD25.git
git push -u origin main
```

## Step 2: Deploy Backend to Vercel

### 2.1 Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2.2 Deploy Backend via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `toosh-legacy/HackUTD25`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty or `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   NODE_ENV=production
   PORT=4000
   ```
   
   Add your Firebase credentials:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

6. Click "Deploy"
7. **Note your backend URL**: `https://your-backend.vercel.app`

### 2.3 Update CORS in Backend

After deployment, update your backend to allow your frontend domain:
- In `backend/src/index.js` or `backend/server.js`, update CORS origin to include your Vercel domains

## Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend API URLs

Before deploying, update API URLs in your frontend:

**Update these files to use environment variables:**
- `frontend/src/hooks/useFeedback.js`
- `frontend/src/pages/Home.jsx`
- Any other files calling `http://localhost:4000`

### 3.2 Create Environment File

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.vercel.app
VITE_REDDIT_API_URL=https://your-reddit-server.vercel.app
```

### 3.3 Deploy Frontend via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import the SAME repository: `toosh-legacy/HackUTD25`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.vercel.app
   VITE_REDDIT_API_URL=https://your-reddit-server.vercel.app
   ```
   
   Add your Firebase frontend config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

6. Click "Deploy"
7. Your app will be live at: `https://your-app.vercel.app`

## Step 4: Deploy Reddit Happiness Server (Optional)

### Option A: Deploy as Separate Vercel Project
1. Create a new project on Vercel
2. Root directory: `backend`
3. Add a new `vercel.json` in backend for the reddit server
4. Point to `reddit-happiness-server.js`

### Option B: Merge into Main Backend
Combine the reddit server endpoints into your main backend (recommended)

### Option C: Run Locally
Keep the Python scraper and reddit server running on your local machine/server

## Step 5: Update Frontend URLs

After both deployments, update `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-ACTUAL-BACKEND.vercel.app/api/:path*"
    }
  ]
}
```

Then redeploy frontend.

## Step 6: Set Up Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment

## Step 7: Python Scraper Options

### Option A: Run Locally
Keep running on your computer:
```bash
cd backend
python reddit-scraper.py
```

### Option B: Deploy to a Cloud Service
- **Heroku** (has Python support)
- **Railway** (easier Python deployment)
- **PythonAnywhere** (Python-specific hosting)
- **AWS Lambda** (serverless functions)

### Option C: Schedule with GitHub Actions
Run the scraper as a scheduled job on GitHub (free)

## Troubleshooting

### Backend Issues
- Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
- Ensure all environment variables are set
- Check CORS settings

### Frontend Issues
- Make sure API URLs use environment variables
- Check browser console for errors
- Verify Firebase config is correct

### Database Issues
- Ensure Firebase Firestore rules allow read/write
- Check Firebase Authentication is enabled

## Testing Your Deployment

1. Visit your frontend URL: `https://your-app.vercel.app`
2. Try signing up/logging in
3. Test the happiness gauges
4. Check if Reddit posts load (if scraper is running)

## Custom Domain (Optional)

1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Your Deployed URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.vercel.app`
- **GitHub Repository**: `https://github.com/toosh-legacy/HackUTD25`

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
