import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all achievements
export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { order: 'asc' },
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST - Create new achievement
export async function POST(request) {
  try {
    const data = await request.json();
    
    const achievement = await prisma.achievement.create({
      data: {
        category: data.category,
        title: data.title,
        description: data.description,
        year: data.year,
        type: data.type,
        organization: data.organization || null,
        rank: data.rank || null,
        value: data.value || null,
        url: data.url || null,
        image: data.image || null,
        isVisible: data.isVisible ?? true,
        order: data.order || 0,
      }
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}

// PUT - Update achievement
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { error: 'Failed to update achievement' },
      { status: 500 }
    );
  }
}

// DELETE - Delete achievement
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    await prisma.achievement.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    );
  }
}
