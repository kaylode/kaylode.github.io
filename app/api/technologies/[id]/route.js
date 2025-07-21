import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Technology ID is required' },
        { status: 400 }
      );
    }

    await prisma.technology.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Technology deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete technology' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Technology ID is required' },
        { status: 400 }
      );
    }

    const technology = await prisma.technology.update({
      where: { id: id },
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
