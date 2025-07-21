import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    await prisma.education.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Education record deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete education record' },
      { status: 500 }
    );
  }
}
