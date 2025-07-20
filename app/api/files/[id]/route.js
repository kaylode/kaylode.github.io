import { NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'

export async function GET(request, { params }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const { id } = params;
    
    const file = await prisma.fileStorage.findUnique({
      where: { id },
      include: {
        blogPostFiles: {
          include: { blogPost: { select: { title: true, slug: true } } }
        },
        projectFiles: {
          include: { project: { select: { title: true } } }
        }
      }
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Increment download count
    await prisma.fileStorage.update({
      where: { id },
      data: { downloadCount: { increment: 1 } }
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const { id } = params;

    await prisma.fileStorage.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
