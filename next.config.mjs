/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	images: {
		unoptimized: true,
	},
	basePath: '', // Leave empty for root domain
};

export default nextConfig;
