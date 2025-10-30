const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const cron = require('node-cron');

const prisma = new PrismaClient();

// GitHub API crawler
async function crawlGitHubStats() {
  try {
    const username = 'kaylode'; // Replace with your GitHub username
    const token = process.env.GITHUB_TOKEN;
    
    const headers = token ? { Authorization: `token ${token}` } : {};
    
    // Get user info
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, { headers });
    const userData = userResponse.data;
    
    // Get repositories
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    const repos = reposResponse.data;
    
    // Calculate stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    // Get language stats
    const languages = {};
    for (const repo of repos.slice(0, 20)) { // Limit to avoid rate limiting
      try {
        const langResponse = await axios.get(repo.languages_url, { headers });
        const repoLangs = langResponse.data;
        for (const [lang, bytes] of Object.entries(repoLangs)) {
          languages[lang] = (languages[lang] || 0) + bytes;
        }
      } catch (error) {
        console.log(`Error fetching languages for ${repo.name}:`, error.message);
      }
    }
    
    // Get top repositories
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url
      }));
    
    // Update database
    await prisma.gitHubStats.upsert({
      where: { username },
      create: {
        username,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        totalStars,
        totalForks,
        languages,
        topRepositories: topRepos,
        lastUpdated: new Date()
      },
      update: {
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        totalStars,
        totalForks,
        languages,
        topRepositories: topRepos,
        lastUpdated: new Date()
      }
    });
    
    console.log('GitHub stats updated successfully');
  } catch (error) {
    console.error('Error crawling GitHub stats:', error.message);
  }
}

// LeetCode API crawler (using GraphQL)
async function crawlLeetCodeStats() {
  try {
    const username = 'kaylochee'; // Replace with your LeetCode username
    
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            userAvatar
            reputation
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          badges {
            id
            displayName
            icon
            creationDate
          }
        }
      }
    `;
    
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    });
    
    if (response.data.data.matchedUser) {
      const userData = response.data.data.matchedUser;
      const submitStats = userData.submitStats.acSubmissionNum;
      
      const easySolved = submitStats.find(s => s.difficulty === 'Easy')?.count || 0;
      const mediumSolved = submitStats.find(s => s.difficulty === 'Medium')?.count || 0;
      const hardSolved = submitStats.find(s => s.difficulty === 'Hard')?.count || 0;
      const totalSolved = easySolved + mediumSolved + hardSolved;
      
      // Update database
      await prisma.leetCodeStats.upsert({
        where: { username },
        create: {
          username,
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          ranking: userData.profile.ranking,
          lastUpdated: new Date()
        },
        update: {
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          ranking: userData.profile.ranking,
          lastUpdated: new Date()
        }
      });
      
      console.log('LeetCode stats updated successfully');
    }
  } catch (error) {
    console.error('Error crawling LeetCode stats:', error.message);
  }
}

// Seed blog posts from existing data
async function seedBlogPosts() {
  try {
    const { blog_posts } = require('../src/data/blog.js');
    
    for (const post of blog_posts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        create: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          publishedAt: new Date(post.publishedAt),
          category: post.category,
          tags: post.tags,
          readTime: post.readTime,
          featured: post.featured,
          image: post.image,
          status: post.status
        },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          readTime: post.readTime,
          featured: post.featured,
          image: post.image,
          status: post.status
        }
      });
    }
    
    console.log('Blog posts seeded successfully');
  } catch (error) {
    console.error('Error seeding blog posts:', error.message);
  }
}

// Main crawl function
async function crawlAllData() {
  console.log('Starting data crawl...', new Date().toISOString());
  
  await crawlGitHubStats();
  await crawlLeetCodeStats();
  
  console.log('Data crawl completed!', new Date().toISOString());
}

// Schedule crawling (daily at 6 AM)
if (process.env.NODE_ENV === 'production') {
  cron.schedule('0 6 * * *', () => {
    console.log('Running scheduled data crawl');
    crawlAllData();
  });
}

// Export functions for manual use
module.exports = {
  crawlGitHubStats,
  crawlLeetCodeStats,
  seedBlogPosts,
  crawlAllData
};

// If run directly, execute based on command line argument
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'github':
      crawlGitHubStats().finally(() => prisma.$disconnect());
      break;
    case 'leetcode':
      crawlLeetCodeStats().finally(() => prisma.$disconnect());
      break;
    case 'seed':
      seedBlogPosts().finally(() => prisma.$disconnect());
      break;
    case 'all':
    default:
      crawlAllData().finally(() => prisma.$disconnect());
      break;
  }
}
