import { NextResponse } from 'next/server'

// Check if database is available
let prisma = null;
try {
  const { prisma: prismaClient } = require('../../../lib/prisma');
  prisma = prismaClient;
} catch (error) {
  console.log('Database not available, using fallback mode');
}

export async function GET() {
  try {
    let stats = null;
    
    // Try to get from database first
    if (prisma) {
      try {
        stats = await prisma.leetCodeStats.findFirst({
          where: {
            username: 'kaylode' // Replace with your LeetCode username
          },
          orderBy: {
            lastUpdated: 'desc'
          }
        });
      } catch (dbError) {
        console.error('Database error, using fallback data:', dbError.message);
      }
    }

    // If no data from database, use static fallback
    if (!stats) {
      try {
        const { leetcode_stats } = await import('../../../src/data/leetcode.js');
        return NextResponse.json(leetcode_stats);
      } catch (importError) {
        console.error('Failed to import static data:', importError.message);
        
        // Final fallback to default mock data
        return NextResponse.json({
          username: 'kaylode',
          totalSolved: 89,
          easySolved: 45,
          mediumSolved: 126,
          hardSolved: 30,
          ranking: 12345,
          lastUpdated: new Date().toISOString()
        });
      }
    }

    // Parse JSON fields and return the data from database
    const parsedStats = {
      ...stats,
      lastUpdated: stats.lastUpdated.toISOString()
    };

    return NextResponse.json(parsedStats)
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch LeetCode stats' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const data = await request.json()
    
    const stats = await prisma.leetCodeStats.upsert({
      where: {
        username: data.username
      },
      create: data,
      update: {
        ...data,
        lastUpdated: new Date()
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error updating LeetCode stats:', error)
    return NextResponse.json(
      { error: 'Failed to update LeetCode stats' },
      { status: 500 }
    )
  }
}
