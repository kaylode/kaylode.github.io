import { NextResponse } from 'next/server'
// Import static blog data as fallback
import { blog_posts } from '../../../src/data/blog.js'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    // For now, use static data from blog.js file
    // This will be replaced with database queries once DB is set up
    let posts = [...blog_posts]

    // Apply filters
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

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    // Return static data as fallback
    return NextResponse.json(blog_posts)
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // For development, just return the posted data with an ID
    const post = {
      id: Date.now().toString(),
      ...data,
      publishedAt: new Date(data.publishedAt || new Date()),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
