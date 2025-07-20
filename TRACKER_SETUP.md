# Tracker Data Setup Guide

## 🎯 Overview
Your tracker now supports real-time data from GitHub and LeetCode! Here's how to set it up and use it.

## 🚀 Quick Start

### 1. Database Setup ✅
- ✅ Prisma database is running
- ✅ Schema is synced
- ✅ Initial data is populated

### 2. Get Your GitHub Token
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "Portfolio Tracker"
4. Select scopes: `public_repo` (for public repositories)
5. Copy the generated token

### 3. Update Environment Variables
Edit your `.env` file and replace:
```bash
GITHUB_TOKEN=your_github_token_here
```
with your actual token:
```bash
GITHUB_TOKEN=ghp_your_actual_token_here
```

## 📊 Available Data Sources

### GitHub Data
- **Public repositories count**
- **Followers & Following**
- **Total stars & forks**
- **Programming language statistics**
- **Top repositories**
- **Commit activity heatmap**

### LeetCode Data
- **Problems solved by difficulty**
- **Total solved count**
- **Current ranking**
- **Progress over time**

## 🔄 How to Update Data

### Method 1: Manual Update (Recommended)
1. Visit: http://localhost:3000/tracker
2. Click the "Update Data" button
3. Wait for the update to complete
4. Refresh to see new data

### Method 2: API Endpoint
```bash
curl -X POST http://localhost:3000/api/update-stats
```

### Method 3: Scheduled Updates
You can set up automatic updates using:
```bash
curl http://localhost:3000/api/cron/crawl-data
```

## 🎛️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/github` | GET | Get GitHub statistics |
| `/api/leetcode` | GET | Get LeetCode statistics |
| `/api/github/commits` | GET | Get commit activity data |
| `/api/update-stats` | POST | Manually trigger data update |
| `/api/cron/crawl-data` | GET | Scheduled update endpoint |

## 🧪 Testing

### Test Individual APIs
```bash
# Test GitHub API
curl http://localhost:3000/api/github

# Test LeetCode API  
curl http://localhost:3000/api/leetcode

# Test Commits API
curl http://localhost:3000/api/github/commits
```

### Check Database Contents
```bash
node scripts/populate-db.js
```

## 🔧 Troubleshooting

### Data Not Updating?
1. **Check GitHub token**: Make sure it's valid and has `public_repo` scope
2. **Check rate limits**: GitHub API has rate limits (5000/hour with token)
3. **Check database**: Run `npx prisma studio` to view database contents
4. **Check logs**: Look at browser console and terminal for errors

### LeetCode Data Not Loading?
- LeetCode's API can be unreliable
- Try again later if it fails
- The system will show mock data as fallback

### Database Issues?
```bash
# Restart Prisma database
npx prisma db push

# View database in browser
npx prisma studio
```

## 🚀 Production Setup

For production deployment:

1. **Environment Variables**:
   ```bash
   DATABASE_URL=your_production_db_url
   GITHUB_TOKEN=your_github_token
   CRON_SECRET=your_secret_for_cron_jobs
   ```

2. **Scheduled Updates**:
   - Set up a cron job or Vercel cron to call `/api/cron/crawl-data`
   - Recommended frequency: Every 6-12 hours

3. **Rate Limiting**:
   - GitHub: 5000 requests/hour with token
   - LeetCode: No official limits, but be respectful

## 🎉 Features

### Current Features
- ✅ Real-time GitHub statistics
- ✅ Real-time LeetCode progress
- ✅ Interactive charts and visualizations
- ✅ Commit activity heatmap
- ✅ Manual data refresh
- ✅ Fallback to mock data

### Coming Soon
- 📈 Historical data tracking
- 🏆 Achievement badges
- 📊 Comparative analytics
- ⚡ Real-time updates via WebSocket

## 📱 Usage

1. **Overview Tab**: General statistics and key metrics
2. **GitHub Tab**: Detailed repository and commit data
3. **LeetCode Tab**: Problem-solving progress and rankings
4. **Time Ranges**: Switch between daily, weekly, monthly, yearly views

Your tracker is now ready to display real data! 🎊
