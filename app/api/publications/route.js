import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    let whereClause = {};
    if (year) {
      whereClause.year = parseInt(year);
    }
    if (category) {
      whereClause.category = category;
    }

    let queryOptions = {
      where: whereClause,
      orderBy: [
        { year: 'desc' },
        { createdAt: 'desc' }
      ],
    };

    if (limit) {
      queryOptions.take = parseInt(limit);
    }

    const publications = await prisma.publication.findMany(queryOptions);

    // Group by year for consistent format with static data
    const groupedByYear = publications.reduce((acc, pub) => {
      if (!acc[pub.year]) {
        acc[pub.year] = [];
      }
      acc[pub.year].push(pub);
      return acc;
    }, {});

    return NextResponse.json(groupedByYear);
  } catch (error) {
    console.error('Database error:', error);
    
    // Fallback to static data
    try {
      const { publications_list } = await import('../../../src/data/publications.js');
      return NextResponse.json(publications_list);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to fetch publications' },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Publication POST request data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'authors', 'venue', 'year', 'category'];
    const missingFields = requiredFields.filter(field => !data[field] || (typeof data[field] === 'string' && data[field].trim() === ''));
    
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
    
    const createData = {
      title: data.title.trim(),
      authors: Array.isArray(data.authors) ? data.authors : data.authors.split(',').map(a => a.trim()).filter(a => a !== ''),
      venue: data.venue.trim(),
      year: parseInt(data.year),
      doi: data.doi && data.doi.trim() !== '' ? data.doi.trim() : null,
      arxivId: data.arxivId && data.arxivId.trim() !== '' ? data.arxivId.trim() : null,
      pdfUrl: data.pdfUrl && data.pdfUrl.trim() !== '' ? data.pdfUrl.trim() : null,
      category: data.category.trim(),
      abstract: data.abstract && data.abstract.trim() !== '' ? data.abstract.trim() : null,
      citations: data.citations ? parseInt(data.citations) : 0,
    };

    console.log('Publication create data:', JSON.stringify(createData, null, 2));
    
    const publication = await prisma.publication.create({
      data: createData,
    });

    console.log('Publication created successfully:', publication);
    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    console.error('Publication POST error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: 'Failed to create publication', 
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
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Publication ID is required' },
        { status: 400 }
      );
    }

    const publication = await prisma.publication.update({
      where: { id: data.id },
      data: {
        title: data.title,
        authors: Array.isArray(data.authors) ? data.authors : data.authors.split(', '),
        venue: data.venue,
        year: parseInt(data.year),
        doi: data.doi,
        arxivId: data.arxivId,
        pdfUrl: data.pdfUrl,
        category: data.category,
        abstract: data.abstract,
        citations: data.citations,
      },
    });

    return NextResponse.json(publication);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update publication' },
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
        { error: 'Publication ID is required' },
        { status: 400 }
      );
    }

    await prisma.publication.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
}
