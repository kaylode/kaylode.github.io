import { NextResponse } from 'next/server';
import { getNotionBlogPosts } from '@/services/notion';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const posts = await getNotionBlogPosts();
		return NextResponse.json(posts);
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
	}
}
