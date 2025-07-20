import { NextResponse } from 'next/server'
import { prisma } from '../../../src/lib/prisma'

export async function GET() {
  try {
    const stats = await prisma.gitHubStats.findFirst({
      where: {
        username: 'kaylode' // Replace with your GitHub username
      },
      orderBy: {
        lastUpdated: 'desc'
      }
    })

    // If no data exists, return mock data for development
    if (!stats) {
      return NextResponse.json({
        username: 'kaylode',
        publicRepos: 50,
        followers: 123,
        following: 45,
        totalStars: 127,
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
          },
          {
            name: 'portfolio-website',
            description: 'Dynamic portfolio built with Next.js',
            stars: 23,
            forks: 8,
            language: 'JavaScript',
            url: 'https://github.com/kaylode/portfolio-website'
          }
        ],
        lastUpdated: new Date().toISOString()
      })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
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
    return NextResponse.json(
      { error: 'Failed to update GitHub stats' },
      { status: 500 }
    )
  }
}
