import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const visible = searchParams.get('visible');

    let whereClause = {};
    if (visible !== null) {
      whereClause.isVisible = visible === 'true';
    }

    const education = await prisma.education.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Database error:', error);
    
    // Fallback to static data
    try {
      const { experiences_data } = await import('../../../src/data/experiences.js');
      return NextResponse.json(experiences_data.education);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to fetch education data' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const education = await prisma.education.create({
      data: {
        institution: data.institution,
        location: data.location,
        degree: data.degree,
        field: data.field,
        period: data.period,
        status: data.status,
        gpa: data.gpa || null,
        description: data.description || null,
        highlights: data.highlights || [],
        logo: data.logo || null,
        type: data.type,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isVisible: data.isVisible ?? true,
        order: data.order || 0,
      },
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create education record' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    const education = await prisma.education.update({
      where: { id: data.id },
      data: {
        institution: data.institution,
        location: data.location,
        degree: data.degree,
        field: data.field,
        period: data.period,
        status: data.status,
        gpa: data.gpa,
        description: data.description,
        highlights: data.highlights,
        logo: data.logo,
        type: data.type,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isVisible: data.isVisible,
        order: data.order,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update education record' },
      { status: 500 }
    );
  }
}
