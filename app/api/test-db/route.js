import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    console.log('Testing database connection...');
    
    // Try to connect and fetch a simple count
    const educationCount = await prisma.education.count();
    console.log('Education count:', educationCount);
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      educationCount: educationCount
    });
  } catch (error) {
    console.error('Database test error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}
