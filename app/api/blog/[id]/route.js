import { NextResponse } from 'next/server';

// Check if database is available
let prisma = null;
try {
  const { prisma: prismaClient } = require('../../../../src/lib/prisma');
  prisma = prismaClient;
} catch (error) {
  console.log('Database not available, using fallback mode');
}

export async function DELETE(request, { params }) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
