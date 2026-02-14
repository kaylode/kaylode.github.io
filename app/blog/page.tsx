import React from 'react';
import Link from 'next/link';
import { getNotionBlogPosts } from '@/services/notion';
import { Card } from '@/components/ui';
import { PenTool, ArrowLeft, Calendar, ExternalLink } from 'lucide-react';

export const metadata = {
	title: "Blog | Minh-Khoi Pham",
	description: "Research notes, academic thoughts, and technical tutorials hosted on Notion.",
};

export default async function BlogIndexPage() {
	const posts = await getNotionBlogPosts();

	return (
		<div className="min-h-screen bg-white dark:bg-slate-950">
			<header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-50 text-xl tracking-tight">
						<ArrowLeft size={20} />
						<span>Portfolio</span>
					</Link>
					<div className="flex items-center gap-4">
						<span className="font-medium text-slate-500">Blog</span>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
				<div className="flex items-center justify-between mb-12">
					<div className="flex items-center gap-3">
						<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
							<PenTool size={24} />
						</div>
						<h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Research & Thoughts</h1>
					</div>
				</div>

				<div className="space-y-12">
					{posts.length > 0 ? (
						posts.map((post) => (
							<a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer" className="group block">
								<article className="relative p-6 -mx-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300">
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
											<Calendar size={14} />
											<span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}</span>
										</div>
										<div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
											<ExternalLink size={18} />
										</div>
									</div>
									<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4">
										{post.title}
									</h2>
									<p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
										{post.summary}
									</p>
									<div className="flex flex-wrap gap-2 mb-4">
										{post.tags.map(tag => (
											<span key={tag} className="px-2 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
												{tag}
											</span>
										))}
									</div>
									<div className="inline-flex items-center font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
										Read on Notion →
									</div>
								</article>
							</a>
						))
					) : (
						<Card className="p-12 text-center text-slate-500 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
							<p className="mb-4">No posts found or Notion API not configured.</p>
							<p className="text-sm">Please set <code>NOTION_TOKEN</code> and <code>NOTION_DATABASE_ID</code> in your environment variables.</p>
						</Card>
					)}
				</div>
			</main>

			<footer className="border-t border-slate-200 dark:border-slate-800 py-16 bg-white dark:bg-slate-950">
				<div className="max-w-7xl mx-auto px-4 text-center">
					<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">© {new Date().getFullYear()} Minh-Khoi Pham</p>
				</div>
			</footer>
		</div>
	);
}
