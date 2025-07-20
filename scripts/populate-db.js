#!/usr/bin/env node

// Simple script to populate the database with real data
// Run with: node scripts/populate-db.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database population...');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create some initial GitHub stats (you can run the API to populate real data)
    const githubStats = await prisma.gitHubStats.upsert({
      where: { username: 'kaylode' },
      create: {
        username: 'kaylode',
        publicRepos: 25,
        followers: 50,
        following: 30,
        totalStars: 100,
        totalForks: 25,
        totalCommits: 500,
        contributionsLastYear: 300,
        languages: {
          Python: 40,
          JavaScript: 30,
          TypeScript: 15,
          Java: 10,
          Other: 5
        },
        topRepositories: [
          {
            name: 'awesome-project',
            description: 'An awesome project',
            stars: 50,
            forks: 10,
            language: 'Python',
            url: 'https://github.com/kaylode/awesome-project'
          }
        ],
        lastUpdated: new Date()
      },
      update: {
        lastUpdated: new Date()
      }
    });

    console.log('✅ GitHub stats created/updated:', githubStats.username);

    // Create some initial LeetCode stats
    const leetcodeStats = await prisma.leetCodeStats.upsert({
      where: { username: 'kaylode' },
      create: {
        username: 'kaylode',
        totalSolved: 150,
        easySolved: 80,
        mediumSolved: 50,
        hardSolved: 20,
        ranking: 125000,
        lastUpdated: new Date()
      },
      update: {
        lastUpdated: new Date()
      }
    });

    console.log('✅ LeetCode stats created/updated:', leetcodeStats.username);

    // Test queries
    const allGithubStats = await prisma.gitHubStats.findMany();
    const allLeetcodeStats = await prisma.leetCodeStats.findMany();

    console.log('\n📊 Current database contents:');
    console.log('GitHub stats entries:', allGithubStats.length);
    console.log('LeetCode stats entries:', allLeetcodeStats.length);

    console.log('\n🎉 Database population completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Add your GitHub token to .env file: GITHUB_TOKEN=your_token_here');
    console.log('2. Visit http://localhost:3000/tracker and click "Update Data" to fetch real data');
    console.log('3. Check the API endpoints:');
    console.log('   - GET /api/github');
    console.log('   - GET /api/leetcode');
    console.log('   - GET /api/github/commits');
    console.log('   - POST /api/update-stats');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ Script failed:', e);
  process.exit(1);
});
