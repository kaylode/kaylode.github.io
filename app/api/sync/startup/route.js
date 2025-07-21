import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This endpoint can be called during app startup or health checks
    // to automatically sync data when the app comes online
    
    console.log('🔄 App startup: Checking if data sync is needed...');

    // Check if database is available
    const { isDatabaseAvailable } = await import('../../../../scripts/sync-database-to-static.js');
    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return NextResponse.json({
        message: 'Database not available, skipping sync',
        dbAvailable: false,
        timestamp: new Date().toISOString()
      });
    }

    // Check last sync status
    const fs = await import('fs').then(mod => mod.promises);
    const path = await import('path');
    
    let shouldSync = true;
    let lastSyncTime = null;

    try {
      const statusFile = path.join(process.cwd(), '.sync-status.json');
      const statusContent = await fs.readFile(statusFile, 'utf8');
      const status = JSON.parse(statusContent);
      
      lastSyncTime = status.syncTime;
      const timeSinceLastSync = Date.now() - new Date(status.syncTime).getTime();
      const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      
      // Only sync if last sync was more than 3 hours ago or failed
      shouldSync = !status.success || timeSinceLastSync > threeHours;
      
    } catch (error) {
      // No status file exists, should sync
      shouldSync = true;
    }

    if (!shouldSync) {
      return NextResponse.json({
        message: 'Recent sync found, skipping automatic sync',
        dbAvailable: true,
        lastSyncTime,
        skipped: true,
        timestamp: new Date().toISOString()
      });
    }

    // Trigger sync in the background (don't wait for completion)
    const { syncAllData } = await import('../../../../scripts/sync-database-to-static.js');
    
    // Start sync without awaiting (fire and forget for startup)
    syncAllData()
      .then((result) => {
        console.log('🎉 Startup sync completed:', result.success ? 'SUCCESS' : 'WITH ERRORS');
      })
      .catch((error) => {
        console.error('❌ Startup sync failed:', error.message);
      });

    return NextResponse.json({
      message: 'Database sync initiated',
      dbAvailable: true,
      syncTriggered: true,
      lastSyncTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Startup sync check error:', error);
    return NextResponse.json({
      error: 'Failed to check sync status',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
