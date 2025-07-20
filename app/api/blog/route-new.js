import { NextResponse } from 'next/server'
import { blog_posts } from '../../../src/data/blog.js'

// Check if database is available
let prisma = null;
try {
  const { prisma: prismaClient } = require('../../../src/lib/prisma');
  prisma = prismaClient;
} catch (error) {
  console.log('Database not available, using fallback mode');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    let posts = [];

    // Try database first, fallback to static data
    if (prisma) {
      try {
        const whereClause = {
          status: 'published',
          ...(category && category !== 'All' && { category }),
          ...(featured === 'true' && { featured: true }),
          ...(tag && { tags: { has: tag } }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
              { excerpt: { contains: search, mode: 'insensitive' } }
            ]
          })
        };

        posts = await prisma.blogPost.findMany({
          where: whereClause,
          orderBy: { publishedAt: 'desc' },
          include: {
            blogPostFiles: {
              include: {
                file: {
                  select: {
                    id: true,
                    filename: true,
                    originalName: true,
                    mimeType: true,
                    size: true,
                    path: true,
                    category: true,
                    description: true
                  }
                }
              }
            }
          }
        });
      } catch (dbError) {
        console.error('Database error, using fallback data:', dbError.message);
        posts = [...blog_posts];
      }
    } else {
      // Use static data as fallback
      posts = [...blog_posts];
    }

    // Apply filters to static data if using fallback
    if (posts === blog_posts) {
      if (category && category !== 'All') {
        posts = posts.filter(post => post.category === category)
      }

      if (featured === 'true') {
        posts = posts.filter(post => post.featured === true)
      }

      if (tag) {
        posts = posts.filter(post => post.tags.includes(tag))
      }

      if (search) {
        const searchLower = search.toLowerCase()
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
        )
      }

      // Sort by published date (newest first)
      posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    // Return static data as ultimate fallback
    return NextResponse.json(blog_posts)
  }
}

export async function POST(request) {
  try {
    if (!prisma) {
      // Fallback for when database is not available
      const data = await request.json()
      const post = {
        id: Date.now().toString(),
        ...data,
        publishedAt: new Date(data.publishedAt || new Date()),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      return NextResponse.json(post, { status: 201 })
    }

    const data = await request.json()
    const { fileIds, ...postData } = data

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        publishedAt: new Date(postData.publishedAt || Date.now()),
        blogPostFiles: fileIds ? {
          create: fileIds.map(fileId => ({ fileId }))
        } : undefined
      },
      include: {
        blogPostFiles: {
          include: { file: true }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
