import { NextResponse } from 'next/server';

// Check if database is available
let prisma = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.log('Database not available, using fallback mode');
}

// GitHub API configuration
const GITHUB_USERNAME = 'kaylode';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// LeetCode API configuration  
const LEETCODE_USERNAME = 'kaylode';

/**
 * Fetch GitHub statistics from GitHub API
 */
async function fetchGitHubStats() {
  try {
    console.log('Fetching GitHub stats...');
    
    const headers = {
      'User-Agent': 'Portfolio-App',
      'Accept': 'application/vnd.github.v3+json',
      ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` })
    };

    // Fetch user info
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers
    });
    if (!userResponse.ok) throw new Error('Failed to fetch GitHub user data');
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
      headers
    });
    if (!reposResponse.ok) throw new Error('Failed to fetch GitHub repositories');
    const reposData = await reposResponse.json();

    // Calculate statistics
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    // Get language statistics
    const languages = {};
    const languageBytes = {};
    
    for (const repo of reposData.slice(0, 30)) { // Limit to avoid rate limiting
      if (repo.language) {
        try {
          const langResponse = await fetch(repo.languages_url, { headers });
          if (langResponse.ok) {
            const repoLangs = await langResponse.json();
            for (const [lang, bytes] of Object.entries(repoLangs)) {
              languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
            }
          }
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.warn(`Could not fetch languages for ${repo.name}:`, error.message);
        }
      }
    }

    // Convert bytes to percentages
    const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
    if (totalBytes > 0) {
      for (const [lang, bytes] of Object.entries(languageBytes)) {
        languages[lang] = Math.round((bytes / totalBytes) * 100);
      }
    }

    // Get top repositories
    const topRepositories = reposData
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map(repo => ({
        name: repo.name,
        description: repo.description || '',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url
      }));

    const stats = {
      username: GITHUB_USERNAME,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      totalForks,
      totalCommits: 0, // Will be updated by commit fetcher
      contributionsLastYear: 0, // Will be updated by commit fetcher
      languages,
      topRepositories,
      lastUpdated: new Date()
    };

    console.log('GitHub stats fetched successfully');
    return stats;

  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
}

/**
 * Fetch LeetCode statistics
 */
async function fetchLeetCodeStats() {
  try {
    console.log('Fetching LeetCode stats...');
    
    // LeetCode GraphQL API
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-App'
      },
      body: JSON.stringify({
        query,
        variables: { username: LEETCODE_USERNAME }
      })
    });

    if (!response.ok) throw new Error('Failed to fetch LeetCode data');
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`LeetCode API error: ${data.errors[0].message}`);
    }

    const user = data.data?.matchedUser;
    if (!user) {
      throw new Error(`LeetCode user ${LEETCODE_USERNAME} not found`);
    }

    const submitStats = user.submitStats?.acSubmissionNum || [];
    const easySolved = submitStats.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = submitStats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = submitStats.find(s => s.difficulty === 'Hard')?.count || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    // Calculate acceptance rate
    const totalSubmissions = submitStats.reduce((sum, s) => sum + s.submissions, 0);
    const acceptanceRate = totalSubmissions > 0 ? ((totalSolved / totalSubmissions) * 100) : 0;

    const stats = {
      username: LEETCODE_USERNAME,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      acceptanceRate: Math.round(acceptanceRate * 10) / 10,
      ranking: user.profile?.ranking || 0,
      contributionPoints: 0,
      contestRating: 0,
      contestParticipation: 0,
      recentSubmissions: [],
      lastUpdated: new Date()
    };

    console.log('LeetCode stats fetched successfully');
    return stats;

  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    throw error;
  }
}

/**
 * Store data in database
 */
async function storeGitHubStats(stats) {
  if (!prisma) throw new Error('Database not available');
  
  try {
    await prisma.gitHubStats.upsert({
      where: { username: stats.username },
      update: {
        publicRepos: stats.publicRepos,
        followers: stats.followers,
        following: stats.following,
        totalStars: stats.totalStars,
        totalForks: stats.totalForks,
        totalCommits: stats.totalCommits,
        contributionsLastYear: stats.contributionsLastYear,
        languages: JSON.stringify(stats.languages),
        topRepositories: JSON.stringify(stats.topRepositories),
        lastUpdated: stats.lastUpdated
      },
      create: {
        username: stats.username,
        publicRepos: stats.publicRepos,
        followers: stats.followers,
        following: stats.following,
        totalStars: stats.totalStars,
        totalForks: stats.totalForks,
        totalCommits: stats.totalCommits,
        contributionsLastYear: stats.contributionsLastYear,
        languages: JSON.stringify(stats.languages),
        topRepositories: JSON.stringify(stats.topRepositories),
        lastUpdated: stats.lastUpdated
      }
    });
    console.log('GitHub stats stored in database');
  } catch (error) {
    console.error('Error storing GitHub stats:', error);
    throw error;
  }
}

async function storeLeetCodeStats(stats) {
  if (!prisma) throw new Error('Database not available');
  
  try {
    await prisma.leetCodeStats.upsert({
      where: { username: stats.username },
      update: {
        totalSolved: stats.totalSolved,
        easySolved: stats.easySolved,
        mediumSolved: stats.mediumSolved,
        hardSolved: stats.hardSolved,
        acceptanceRate: stats.acceptanceRate,
        ranking: stats.ranking,
        contributionPoints: stats.contributionPoints,
        contestRating: stats.contestRating,
        contestParticipation: stats.contestParticipation,
        recentSubmissions: JSON.stringify(stats.recentSubmissions),
        lastUpdated: stats.lastUpdated
      },
      create: {
        username: stats.username,
        totalSolved: stats.totalSolved,
        easySolved: stats.easySolved,
        mediumSolved: stats.mediumSolved,
        hardSolved: stats.hardSolved,
        acceptanceRate: stats.acceptanceRate,
        ranking: stats.ranking,
        contributionPoints: stats.contributionPoints,
        contestRating: stats.contestRating,
        contestParticipation: stats.contestParticipation,
        recentSubmissions: JSON.stringify(stats.recentSubmissions),
        lastUpdated: stats.lastUpdated
      }
    });
    console.log('LeetCode stats stored in database');
  } catch (error) {
    console.error('Error storing LeetCode stats:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    console.log('Starting manual stats update...');
    
    if (!prisma) {
      return NextResponse.json({
        success: false,
        message: 'Database not available'
      }, { status: 503 });
    }

    // Fetch data from APIs
    const [githubStats, leetcodeStats] = await Promise.all([
      fetchGitHubStats(),
      fetchLeetCodeStats()
    ]);

    // Store in database
    await Promise.all([
      storeGitHubStats(githubStats),
      storeLeetCodeStats(leetcodeStats)
    ]);

    console.log('Stats update completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Stats updated successfully',
      data: {
        github: {
          username: githubStats.username,
          publicRepos: githubStats.publicRepos,
          totalStars: githubStats.totalStars,
          followers: githubStats.followers
        },
        leetcode: {
          username: leetcodeStats.username,
          totalSolved: leetcodeStats.totalSolved,
          ranking: leetcodeStats.ranking
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update stats',
      error: error.message
    }, { status: 500 });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

export async function GET(request) {
  return NextResponse.json({
    message: 'Use POST method to trigger stats update',
    endpoints: {
      'POST /api/update-stats': 'Trigger manual update of GitHub and LeetCode stats'
    }
  });
}