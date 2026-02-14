import { Client } from '@notionhq/client';

export interface NotionPost {
	id: string;
	title: string;
	summary: string;
	publishedAt: string;
	url: string;
	tags: string[];
}

export async function getNotionBlogPosts(): Promise<NotionPost[]> {
	const NOTION_TOKEN = process.env.NEXT_PUBLIC_NOTION_TOKEN;
	const DATABASE_ID = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;

	if (!NOTION_TOKEN || !DATABASE_ID) {
		console.warn('NEXT_PUBLIC_NOTION_TOKEN or NEXT_PUBLIC_NOTION_DATABASE_ID is not set');
		return [];
	}

	const notion = new Client({
		auth: NOTION_TOKEN,
	});

	try {
		// In the latest Notion SDK, use dataSources.query instead of databases.query
		const response = await notion.dataSources.query({
			data_source_id: DATABASE_ID,
			filter: {
				property: 'Status',
				status: {
					equals: 'Published',
				},
			},
			sorts: [
				{
					property: 'Date',
					direction: 'descending',
				},
			],
		});

		return response.results.map((page: any) => {
			const properties = page.properties;

			// Extract title
			const title = properties.Title?.title?.[0]?.plain_text || 'Untitled';

			// Extract summary
			const summary = properties.Summary?.rich_text?.[0]?.plain_text || '';

			// Extract date
			const publishedAt = properties.Date?.date?.start || page.created_time;

			// Extract URL - check for a custom URL property first, then fallback to public_url
			const customUrl = properties.Link?.url;
			const url = customUrl || page.public_url || `https://www.notion.so/${page.id.replace(/-/g, '')}`;

			// Extract tags
			const tags = properties.Tags?.multi_select?.map((s: any) => s.name) || [];

			return {
				id: page.id,
				title,
				summary,
				publishedAt,
				url,
				tags,
			};
		});
	} catch (error) {
		console.error('Error fetching from Notion:', error);
		return [];
	}
}
