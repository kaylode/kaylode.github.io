import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Verify authorization in production
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.SYNC_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting database sync to static files...');

    // Dynamic import to avoid loading sync script at build time
    const { syncAllData } = await import('../../../../scripts/sync-database-to-static.js');
    
    const results = await syncAllData();

    if (results.success) {
      return NextResponse.json({
        message: 'Database sync completed successfully',
        timestamp: new Date().toISOString(),
        stats: results.stats,
        duration: results.duration
      }, { status: 200 });
    } else {
      return NextResponse.json({
        message: 'Database sync completed with errors',
        timestamp: new Date().toISOString(),
        stats: results.stats,
        errors: results.errors,
        duration: results.duration
      }, { status: 207 }); // 207 Multi-Status for partial success
    }

  } catch (error) {
    console.error('API sync error:', error);
    return NextResponse.json({
      error: 'Failed to sync database to static files',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    // Return sync status
    const fs = await import('fs').then(mod => mod.promises);
    const path = await import('path');
    
    try {
      const statusFile = path.join(process.cwd(), '.sync-status.json');
      const statusContent = await fs.readFile(statusFile, 'utf8');
      const status = JSON.parse(statusContent);
      
      return NextResponse.json({
        lastSync: status,
        message: 'Sync status retrieved successfully'
      });
    } catch (fileError) {
      return NextResponse.json({
        message: 'No sync status found',
        lastSync: null
      });
    }

  } catch (error) {
    console.error('API status error:', error);
    return NextResponse.json({
      error: 'Failed to retrieve sync status',
      details: error.message
    }, { status: 500 });
  }
}
