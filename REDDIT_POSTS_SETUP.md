# Reddit Posts Display - Setup Complete ✅

## What's Been Implemented

### Backend Updates:
1. **reddit-scraper.py** - Now saves top 15 posts to `reddit-posts.json`
2. **reddit-happiness-server.js** - Added `/api/reddit-posts` endpoint
3. **reddit-posts.json** - Test file with 3 sample posts

### Frontend Updates:
1. **Home.jsx** - Updated to show posts on left, gauges on right
2. **Home.css** - New responsive layout with scrollable posts section

## Features:
✅ Shows 15 most recent posts
✅ Displays: Title, Content, Date/Time, Subreddit
✅ Scrollable posts container
✅ Auto-refreshes every 30 minutes
✅ Posts are NOT clickable
✅ Clean, modern design

## To Test:

### Option 1: Test with Sample Data (No Python needed)
```bash
# Terminal 1 - Main Backend
cd backend
npm run dev

# Terminal 2 - Reddit Server
cd backend
node reddit-happiness-server.js

# Terminal 3 - Frontend
cd frontend
npm run dev
```

You'll see 3 sample posts on the left and gauges on the right!

### Option 2: Run Full Scraper
```bash
# Terminal 1 - Main Backend
cd backend
npm run dev

# Terminal 2 - Reddit Server
cd backend
node reddit-happiness-server.js

# Terminal 3 - Python Scraper
cd backend
python reddit-scraper.py

# Terminal 4 - Frontend
cd frontend
npm run dev
```

The scraper will fetch real posts from r/tmobile and r/tmobileisp!

## File Locations:
- **Posts data**: `backend/reddit-posts.json`
- **Happiness data**: `backend/happiness.json`
- **Layout**: Posts (left) | Gauges (right)

## Auto-Refresh Timing:
- **Posts**: Every 30 minutes (matches scraper cycle)
- **Overall Happiness**: Every 30 seconds
