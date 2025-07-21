# Data Sync System Documentation

## Overview

The Data Sync System automatically synchronizes data from your Google Cloud PostgreSQL database to static files, ensuring your portfolio app has up-to-date fallback data even if the cloud database goes offline.

## 🎯 Purpose

- **Reliability**: Ensures your app continues working if the cloud database is unavailable
- **Performance**: Provides fast static data access for fallback scenarios
- **Maintenance**: Automatically keeps static data synchronized with database changes

## 🏗️ Architecture

### Components

1. **Sync Script** (`scripts/sync-database-to-static.js`)
   - Connects to PostgreSQL database
   - Fetches all content (projects, publications, experiences, etc.)
   - Writes formatted data to static files in `src/data/`

2. **API Endpoints**
   - `/api/sync/database-to-static` - Manual sync trigger
   - `/api/sync/startup` - Startup sync check

3. **React Hooks & Providers**
   - `useDataSync` - Hook for automatic syncing
   - `DataSyncProvider` - App-level sync management
   - `StartupSync` - Startup sync trigger

4. **Admin Dashboard** (`DataSyncManager`)
   - Visual sync status and controls
   - Manual sync triggering
   - Detailed sync statistics

5. **CLI Commands**
   - `npm run data:sync` - Manual sync
   - `npm run data:status` - Check sync status
   - `npm run data:help` - Show help

## 🔄 Sync Process

### Data Synced
- **Projects** → `src/data/projects.js`
- **Publications** → `src/data/publications.js`
- **Experiences** → `src/data/experiences.js`
- **Education** → Combined in experiences
- **Technologies** → `src/data/techs.js`
- **Achievements** → Combined in experiences
- **Blog Posts** → `src/data/blog.js`

### Sync Triggers

1. **Automatic (Production)**
   - Every 30 minutes when app is active
   - On app startup (if last sync > 3 hours)
   - When browser tab becomes visible

2. **Manual**
   - Admin dashboard "Sync Now" button
   - CLI command: `npm run data:sync`
   - API call: `POST /api/sync/database-to-static`

## 📁 File Structure

```
scripts/
├── sync-database-to-static.js    # Main sync logic
└── data-sync-cli.js              # CLI interface

app/api/sync/
├── database-to-static/route.js   # API endpoint
└── startup/route.js              # Startup sync

src/
├── hooks/
│   └── useDataSync.js            # React hook
├── components/
│   ├── providers/
│   │   └── DataSyncProvider.jsx  # Context provider
│   ├── admin/
│   │   └── DataSyncManager.jsx   # Admin UI
│   └── utils/
│       └── StartupSync.jsx       # Startup component
└── data/                         # Generated static files
    ├── projects.js
    ├── publications.js
    ├── experiences.js
    ├── techs.js
    └── blog.js
```

## 🚀 Setup & Configuration

### 1. Environment Variables

```env
# Required for production sync
DATABASE_URL=your_postgresql_connection_string
SYNC_SECRET=your_sync_secret_key  # For API authentication

# Optional for development
NEXT_PUBLIC_ENABLE_STARTUP_SYNC=true  # Enable startup sync in dev
```

### 2. Production Deployment

The sync system is automatically enabled in production with:
- Startup sync on app launch
- Periodic sync every 30 minutes
- Visual monitoring in admin dashboard

### 3. Development Usage

```bash
# Manual sync during development
npm run data:sync

# Check sync status
npm run data:status

# View help
npm run data:help
```

## 🎛️ Configuration Options

### DataSyncProvider Options

```jsx
<DataSyncProvider 
  enableAutoSync={true}           // Enable automatic syncing
  syncInterval={30 * 60 * 1000}   // Sync interval (30 minutes)
  showNotifications={false}       // Show sync notifications
  maxRetries={3}                  // Max retry attempts
>
  {children}
</DataSyncProvider>
```

### useDataSync Hook Options

```javascript
const {
  syncStatus,
  performSync,
  isLoading,
  lastSync,
  error,
  stats
} = useDataSync({
  enableAutoSync: true,
  syncInterval: 30 * 60 * 1000,
  onSyncComplete: (result) => { /* callback */ },
  onSyncError: (error, willRetry) => { /* callback */ },
  maxRetries: 3
});
```

## 📊 Sync Status & Monitoring

### Status Information
- **Last Sync Time**: When sync last ran
- **Success/Failure**: Whether sync completed successfully
- **Duration**: How long sync took
- **Statistics**: Number of items synced per content type
- **Errors**: Any errors encountered during sync

### Monitoring Locations
1. **Admin Dashboard** - Visual sync status and controls
2. **Console Logs** - Detailed sync information
3. **`.sync-status.json`** - Persistent sync status file
4. **API Responses** - Programmatic access to sync status

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` environment variable
   - Verify database server is accessible
   - Check firewall and network settings

2. **Sync Fails with Permissions Error**
   - Verify file system write permissions
   - Check that `src/data/` directory exists

3. **Sync Skipped in Development**
   - Set `NEXT_PUBLIC_ENABLE_STARTUP_SYNC=true`
   - Use manual sync: `npm run data:sync`

4. **Old Data in Static Files**
   - Check if database has newer content
   - Manually trigger sync from admin dashboard
   - Verify sync is completing successfully

### Debug Commands

```bash
# Check database connectivity
npm run data:sync

# View detailed sync status
npm run data:status

# Check log files (if configured)
tail -f logs/sync.log
```

## 🔐 Security Considerations

- API endpoints are protected with `SYNC_SECRET` in production
- Database connection uses secure environment variables
- File writes are restricted to designated directories
- Admin sync controls require authentication

## 🔄 Fallback Behavior

Your app components are designed to:
1. **Try database first** - Fetch from PostgreSQL API
2. **Fall back to static** - Use synced static files if API fails
3. **Graceful degradation** - Show user-friendly messages if both fail

Example fallback pattern:
```javascript
try {
  // Try database API
  const response = await fetch('/api/projects');
  const projects = await response.json();
  setProjects(projects);
} catch (error) {
  // Fall back to static data
  const { project_list } = await import('../data/projects');
  setProjects(project_list);
}
```

## 📈 Performance Impact

- **Sync Process**: Runs in background, doesn't block UI
- **File Sizes**: Static files are optimized and gzipped
- **Memory Usage**: Minimal impact on app performance
- **Network**: Only syncs when database is online

## 🔮 Future Enhancements

- **Incremental Sync**: Only sync changed data
- **Compression**: Compress static files for smaller size
- **CDN Integration**: Deploy static files to CDN
- **Webhook Triggers**: Sync on database changes
- **Monitoring Dashboard**: Advanced sync analytics

---

**Last Updated**: January 2025  
**Version**: 1.0.0
