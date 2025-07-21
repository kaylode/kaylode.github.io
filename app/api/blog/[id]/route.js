import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const blogPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        files: true
      }
    });

    if (!blogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedBlogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
        tags: data.tags || [],
        category: data.category,
        readingTime: data.readingTime,
        featuredImage: data.featuredImage,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        updatedAt: new Date()
      },
      include: {
        files: true
      }
    });

    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
