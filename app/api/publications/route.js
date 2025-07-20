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
    
    const publication = await prisma.publication.create({
      data: {
        title: data.title,
        authors: Array.isArray(data.authors) ? data.authors : data.authors.split(', '),
        venue: data.venue,
        year: parseInt(data.year),
        doi: data.doi || null,
        arxivId: data.arxivId || null,
        pdfUrl: data.pdfUrl || null,
        category: data.category,
        abstract: data.abstract || null,
        citations: data.citations || 0,
      },
    });

    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create publication' },
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
