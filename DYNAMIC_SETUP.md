# Dynamic Portfolio Deployment Guide

## 🚀 Quick Setup for Dynamic Portfolio

Your portfolio has been successfully transformed into a dynamic web application! Here's how to complete the setup:

## 1. Database Setup (Choose One)

### Option A: Vercel Postgres (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Create a Postgres database in Vercel dashboard
# Copy the DATABASE_URL from Vercel
```

### Option B: Supabase (Free Alternative)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option C: Local PostgreSQL
```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or use Docker
docker run --name portfolio-db -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres

# Create database
createdb portfolio
```

## 2. Environment Variables Setup

Update your `.env` file with real values:

```env
# Database
DATABASE_URL="your_actual_database_url_here"

# GitHub API (for stats crawling)
GITHUB_TOKEN="ghp_your_github_personal_access_token"

# LeetCode Username
LEETCODE_USERNAME="your_leetcode_username"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_random_secret_key"

# Cron Security
CRON_SECRET="your_cron_secret"
```

## 3. Database Migration

```bash
# Push database schema
npm run db:push

# Seed with existing blog data
npm run crawl seed

# Optional: Start Prisma Studio to view data
npm run db:studio
```

## 4. Local Development

```bash
# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/blog
curl http://localhost:3000/api/github
curl http://localhost:3000/api/leetcode
```

## 5. Deploy to Vercel

```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard:
# - DATABASE_URL
# - GITHUB_TOKEN  
# - NEXTAUTH_SECRET
# - CRON_SECRET

# Enable cron jobs in Vercel dashboard
```

## 6. Features Now Available

✅ **Dynamic Blog System**
- Database-driven blog posts
- Search and filtering
- Categories and tags
- Featured posts

✅ **Comprehensive Tracker Dashboard**
- GitHub activity heatmap (365-day view)
- LeetCode progress tracking with difficulty breakdown
- Programming language statistics
- Real-time stats with daily/monthly/yearly views
- Interactive charts and visualizations

✅ **Data Crawling**
- GitHub stats auto-update
- LeetCode progress tracking
- Daily automated crawls

✅ **API Endpoints**
- `/api/blog` - Blog posts management
- `/api/github` - GitHub statistics
- `/api/github/commits` - Commit activity data
- `/api/leetcode` - LeetCode stats
- `/api/cron/crawl-data` - Manual data refresh

✅ **Analytics Ready**
- Page view tracking structure
- Visitor analytics foundation

## 7. Manual Data Updates

```bash
# Crawl GitHub stats
npm run crawl github

# Crawl LeetCode stats  
npm run crawl leetcode

# Crawl all data
npm run crawl all

# Seed blog posts
npm run crawl seed
```

## 8. Next Steps & Future Features

🔄 **Auto-Deployment**
- GitHub Actions for CI/CD
- Automated testing

📊 **Enhanced Analytics**
- Google Analytics integration
- Custom dashboard

🎨 **CMS Integration**
- Admin panel for blog management
- Rich text editor

🔐 **Authentication**
- Admin login system
- Content management

🔍 **SEO Optimization**
- Meta tags generation
- Sitemap automation

## Architecture Overview

```
Your Portfolio (Next.js)
├── Frontend (React + Tailwind)
├── Backend (Next.js API Routes)
├── Database (PostgreSQL + Prisma)
├── Data Crawling (Node.js Scripts)
├── Deployment (Vercel)
└── Monitoring (Built-in Analytics)
```

## Troubleshooting

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database exists

**API Errors:**
- Check Prisma client generation: `npm run db:generate`
- Verify environment variables
- Check server logs

**Deployment Issues:**
- Ensure all environment variables are set in Vercel
- Check build logs for errors
- Verify domain configuration

Your portfolio is now a fully dynamic, scalable web application ready for production! 🎉
