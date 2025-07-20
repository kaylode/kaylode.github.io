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
        stats = await prisma.gitHubStats.findFirst({
          where: {
            username: 'kaylode'
          },
          orderBy: {
            lastUpdated: 'desc'
          }
        });
      } catch (dbError) {
        console.error('Database error, using fallback data:', dbError.message);
      }
    }

    // If no data exists or database unavailable, return mock data
    if (!stats) {
      return NextResponse.json({
        username: 'kaylode',
        publicRepos: 33,
        followers: 100,
        following: 45,
        totalStars: 494,
        totalForks: 34,
        totalCommits: 1234,
        contributionsLastYear: 856,
        languages: {
          Python: 35,
          JavaScript: 25,
          TypeScript: 20,
          Java: 10,
          'C++': 10
        },
        topRepositories: [
          {
            name: 'awesome-ai-project',
            description: 'A comprehensive AI toolkit for computer vision',
            stars: 45,
            forks: 12,
            language: 'Python',
            url: 'https://github.com/kaylode/awesome-ai-project'
          }
        ],
        lastUpdated: new Date().toISOString()
      })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const data = await request.json()
    
    const stats = await prisma.gitHubStats.upsert({
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
    console.error('Error updating GitHub stats:', error)
    return NextResponse.json({ error: 'Failed to update GitHub stats' }, { status: 500 })
  }
}
