import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const visible = searchParams.get('visible');

    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    if (visible !== null) {
      whereClause.isVisible = visible === 'true';
    }

    const technologies = await prisma.technology.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(technologies);
  } catch (error) {
    console.error('Database error:', error);
    
    // Fallback to static data
    try {
      const { techs } = await import('../../../src/data/techs.js');
      return NextResponse.json(techs);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to fetch technologies' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const technology = await prisma.technology.create({
      data: {
        name: data.name,
        category: data.category || 'tools',
        icon: data.icon || null,
        description: data.description || null,
        proficiency: data.proficiency || 'intermediate',
        yearStarted: data.yearStarted || null,
        isVisible: data.isVisible ?? true,
        order: data.order || 0,
        color: data.color || null,
      },
    });

    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create technology' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Technology ID is required' },
        { status: 400 }
      );
    }

    const technology = await prisma.technology.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category,
        icon: data.icon,
        description: data.description,
        proficiency: data.proficiency,
        yearStarted: data.yearStarted,
        isVisible: data.isVisible,
        order: data.order,
        color: data.color,
      },
    });

    return NextResponse.json(technology);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update technology' },
      { status: 500 }
    );
  }
}
