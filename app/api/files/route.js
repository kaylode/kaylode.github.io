import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const files = await prisma.fileStorage.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: {
        blogPostFiles: {
          include: { blogPost: { select: { title: true, slug: true } } }
        },
        projectFiles: {
          include: { project: { select: { title: true } } }
        }
      }
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const data = await request.json();
    const { filename, originalName, mimeType, size, path, category, description, isPublic = true } = data;

    const file = await prisma.fileStorage.create({
      data: {
        filename,
        originalName,
        mimeType,
        size,
        path,
        category,
        description,
        isPublic
      }
    });

    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error('Error creating file record:', error);
    return NextResponse.json({ error: 'Failed to create file record' }, { status: 500 });
  }
}
