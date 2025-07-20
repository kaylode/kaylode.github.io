# Google Cloud PostgreSQL Setup Guide

This guide will help you set up Google Cloud SQL with PostgreSQL for your portfolio application.

## Prerequisites

1. Google Cloud Platform account
2. Google Cloud CLI installed (optional but recommended)
3. Credit card for billing (free tier available)

## Step 1: Create Google Cloud SQL Instance

### Via Google Cloud Console

1. **Navigate to Cloud SQL**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to **SQL** → **Create Instance** → **PostgreSQL**

2. **Configure Instance**
   ```
   Instance ID: portfolio-db
   Password: [Create a strong password]
   Database Version: PostgreSQL 15
   Region: us-central1 (or closest to your users)
   Zone: Any
   ```

3. **Machine Configuration**
   ```
   Machine Type: Shared core (1 vCPU, 0.614 GB memory) - Free tier
   Storage Type: SSD
   Storage Size: 10 GB (can be increased later)
   Enable automatic storage increases: Yes
   ```

4. **Connectivity**
   ```
   Public IP: Enable
   Authorized Networks: Add 0.0.0.0/0 (allows all IPs - for development)
   SSL Mode: Allow unencrypted connections (for easier setup)
   ```

### Via gcloud CLI (Alternative)

```bash
# Create the instance
gcloud sql instances create portfolio-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=[YOUR_PASSWORD]

# Create the database
gcloud sql databases create portfolio --instance=portfolio-db
```

## Step 2: Create Database and User

1. **Connect to your instance**
   - In Cloud Console, go to your instance
   - Click **Connect using Cloud Shell**

2. **Create application database**
   ```sql
   CREATE DATABASE portfolio;
   ```

3. **Create application user** (optional, for security)
   ```sql
   CREATE USER portfolio_user WITH PASSWORD 'your_app_password';
   GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
   ```

## Step 3: Get Connection Details

Your connection string will be in this format:
```
postgresql://username:password@host:port/database

Example:
postgresql://postgres:yourpassword@35.123.456.789:5432/portfolio
```

### Connection Components:
- **Host**: Your instance's public IP (found in Cloud Console)
- **Port**: 5432 (default PostgreSQL port)
- **Username**: postgres (or your custom user)
- **Password**: The password you set
- **Database**: portfolio

## Step 4: Configure Environment Variables

### In Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **portfolio**
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
DATABASE_URL = postgresql://postgres:yourpassword@35.123.456.789:5432/portfolio
GITHUB_TOKEN = your_github_personal_access_token
```

### For Local Development:

Update your `.env` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@35.123.456.789:5432/portfolio"
GITHUB_TOKEN="your_github_token"
```

## Step 5: Update Prisma Schema

Your current schema in `prisma/schema.prisma` will be extended to support blogs and file storage.

## Step 6: Deploy Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

## Step 7: Test Connection

Run your application locally:
```bash
npm run dev
```

Visit: http://localhost:3000/api/github to test database connectivity.

## Security Best Practices

### For Production:

1. **Restrict IP Access**
   - Remove 0.0.0.0/0 from authorized networks
   - Add only necessary IP ranges

2. **Enable SSL**
   - Enable SSL connections in Cloud SQL
   - Update connection string to use SSL

3. **Use IAM Authentication** (Advanced)
   - Enable Cloud SQL IAM authentication
   - Use service account instead of password

4. **Environment Variables**
   - Never commit actual passwords to git
   - Use Vercel's environment variable system
   - Rotate passwords regularly

## Cost Management

### Free Tier Limits:
- 1 shared-core instance
- 0.614 GB RAM
- 10 GB SSD storage
- Network usage charges may apply

### Monitoring:
- Set up billing alerts in Google Cloud Console
- Monitor usage in Cloud SQL dashboard

## Troubleshooting

### Common Issues:

1. **Connection Timeout**
   - Check authorized networks include your IP
   - Verify instance is running

2. **Authentication Failed**
   - Verify username/password
   - Check database name is correct

3. **Prisma Connection Error**
   - Ensure DATABASE_URL format is correct
   - Check if database exists

### Debug Commands:

```bash
# Test connection with psql
psql "postgresql://postgres:password@host:5432/portfolio"

# Check Prisma connection
npx prisma db pull

# View Prisma client status
npx prisma generate
```

## Next Steps

1. Set up automated backups in Google Cloud Console
2. Configure monitoring and alerts
3. Set up staging database for testing
4. Implement connection pooling for production
