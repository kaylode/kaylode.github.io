import { NextResponse } from 'next/server'
import { prisma } from '../../../src/lib/prisma'

export async function GET() {
  try {
    const stats = await prisma.leetCodeStats.findFirst({
      where: {
        username: 'kaylode' // Replace with your LeetCode username
      },
      orderBy: {
        lastUpdated: 'desc'
      }
    })

    // If no data exists, return mock data for development
    if (!stats) {
      return NextResponse.json({
        username: 'kaylode',
        totalSolved: 245,
        easySolved: 89,
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

    return NextResponse.json(stats)
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
