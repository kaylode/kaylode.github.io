import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const visible = searchParams.get('visible');

    let whereClause = {};
    if (type) {
      whereClause.type = type;
    }
    if (visible !== null) {
      whereClause.isVisible = visible === 'true';
    }

    const experiences = await prisma.experience.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Database error:', error);
    
    // Fallback to static data
    try {
      const { experiences_data } = await import('../../../src/data/experiences.js');
      return NextResponse.json(experiences_data.professional);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to fetch experience data' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const experience = await prisma.experience.create({
      data: {
        company: data.company,
        position: data.position,
        location: data.location || null,
        period: data.period,
        type: data.type || 'professional',
        description: data.description || null,
        responsibilities: data.responsibilities || [],
        achievements: data.achievements || [],
        technologies: data.technologies || [],
        logo: data.logo || null,
        website: data.website || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent ?? false,
        isVisible: data.isVisible ?? true,
        order: data.order || 0,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create experience record' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.update({
      where: { id: data.id },
      data: {
        company: data.company,
        position: data.position,
        location: data.location,
        period: data.period,
        type: data.type,
        description: data.description,
        responsibilities: data.responsibilities,
        achievements: data.achievements,
        technologies: data.technologies,
        logo: data.logo,
        website: data.website,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent,
        isVisible: data.isVisible,
        order: data.order,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update experience record' },
      { status: 500 }
    );
  }
}
