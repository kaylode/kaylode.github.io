import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Verify this is a legitimate cron request (in production, you'd add proper auth)
    const authHeader = request.headers.get('authorization')
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Trigger the update-stats API
    const updateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/update-stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await updateResponse.json();
    
    return NextResponse.json({ 
      message: 'Data crawl completed successfully',
      timestamp: new Date().toISOString(),
      results: result
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Failed to execute data crawl', details: error.message },
      { status: 500 }
    )
  }
}
