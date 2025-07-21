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
    console.log('Education POST request data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['institution', 'location', 'degree', 'field', 'status', 'type'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missingFields: missingFields
        },
        { status: 400 }
      );
    }
    
    // Calculate period automatically if startDate and endDate are provided
    let period = data.period;
    if (data.startDate && !period) {
      const startDate = new Date(data.startDate);
      const endDate = data.endDate ? new Date(data.endDate) : null;
      
      const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
      const startYear = startDate.getFullYear();
      
      if (endDate) {
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
        const endYear = endDate.getFullYear();
        period = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
      } else {
        period = `${startMonth} ${startYear} - Present`;
      }
    }

    // Ensure period is not empty
    if (!period || period.trim() === '') {
      period = 'Period not specified';
    }

    const createData = {
      institution: data.institution.trim(),
      location: data.location.trim(),
      degree: data.degree.trim(),
      field: data.field.trim(),
      period: period.trim(),
      status: data.status.trim(),
      gpa: data.gpa && data.gpa.trim() !== '' ? data.gpa.trim() : null,
      description: data.description && data.description.trim() !== '' ? data.description.trim() : null,
      highlights: Array.isArray(data.highlights) ? data.highlights.filter(h => h && h.trim() !== '') : [],
      logo: data.logo && data.logo.trim() !== '' ? data.logo.trim() : null,
      type: data.type.trim(),
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      isVisible: data.isVisible ?? true,
      order: Number(data.order) || 0,
    };

    console.log('Education create data:', JSON.stringify(createData, null, 2));
    
    const education = await prisma.education.create({
      data: createData,
    });

    console.log('Education created successfully:', education);
    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error('Education POST error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: 'Failed to create education record', 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    console.log('Education PUT request data:', data);
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    // Calculate period automatically if startDate and endDate are provided
    let period = data.period;
    if (data.startDate && !period) {
      const startDate = new Date(data.startDate);
      const endDate = data.endDate ? new Date(data.endDate) : null;
      
      const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
      const startYear = startDate.getFullYear();
      
      if (endDate) {
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
        const endYear = endDate.getFullYear();
        period = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
      } else {
        period = `${startMonth} ${startYear} - Present`;
      }
    }

    const updateData = {
      institution: data.institution,
      location: data.location,
      degree: data.degree,
      field: data.field,
      period: period || data.period,
      status: data.status,
      gpa: data.gpa || null,
      description: data.description || null,
      highlights: data.highlights || [],
      logo: data.logo || null,
      type: data.type || 'bachelor',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      isVisible: data.isVisible ?? true,
      order: data.order || 0,
    };

    console.log('Education update data:', updateData);

    const education = await prisma.education.update({
      where: { id: data.id },
      data: updateData,
    });

    console.log('Education updated successfully:', education);
    return NextResponse.json(education);
  } catch (error) {
    console.error('Education PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update education record', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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
