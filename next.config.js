/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com', 'leetcode.com'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    LEETCODE_USERNAME: process.env.LEETCODE_USERNAME,
  },
}

module.exports = nextConfig
