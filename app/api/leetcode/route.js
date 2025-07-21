import { NextResponse } from 'next/server'

// Check if database is available
let prisma = null;
try {
  const { prisma: prismaClient } = require('../../../src/lib/prisma');
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

    // If no data exists or database unavailable, return mock data for development
    if (!stats) {
      return NextResponse.json({
        username: 'kaylode',
        totalSolved: 89,
        easySolved: 45,
        mediumSolved: 126,
        hardSolved: 30,
        acceptanceRate: 75.2,
        ranking: 12345,
        contributionPoints: 1850,
        contestRating: 1650,
        contestParticipation: 15,
        recentSubmissions: [
          {
            title: 'Two Sum',
            difficulty: 'Easy',
            status: 'Accepted',
            date: '2024-07-20'
          },
          {
            title: 'Binary Tree Inorder Traversal',
            difficulty: 'Medium',
            status: 'Accepted',
            date: '2024-07-19'
          }
        ],
        skillStats: {
          algorithms: 85,
          dataStructures: 78,
          mathematics: 70,
          database: 65
        },
        lastUpdated: new Date().toISOString()
      })
    }

    // Parse JSON fields and return the data
    const parsedStats = {
      ...stats,
      recentSubmissions: typeof stats.recentSubmissions === 'string' ? JSON.parse(stats.recentSubmissions) : stats.recentSubmissions,
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
