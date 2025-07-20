import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const language = searchParams.get('language');

    let whereClause = {};
    if (featured !== null) {
      whereClause.featured = featured === 'true';
    }
    if (language) {
      whereClause.language = language;
    }

    let queryOptions = {
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { stars: 'desc' },
        { updatedAt: 'desc' }
      ],
      include: {
        projectFiles: {
          include: {
            file: true
          }
        }
      }
    };

    if (limit) {
      queryOptions.take = parseInt(limit);
    }

    const projects = await prisma.project.findMany(queryOptions);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Database error:', error);
    
    // Fallback to static data
    try {
      const { project_list } = await import('../../../src/data/projects.js');
      return NextResponse.json(project_list);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        technologies: data.technologies || [],
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        image: data.image || null,
        featured: data.featured || false,
        stars: data.stars || 0,
        forks: data.forks || 0,
        language: data.language || null,
      },
      include: {
        projectFiles: {
          include: {
            file: true
          }
        }
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        image: data.image,
        featured: data.featured,
        stars: data.stars,
        forks: data.forks,
        language: data.language,
      },
      include: {
        projectFiles: {
          include: {
            file: true
          }
        }
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
