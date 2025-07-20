import { NextResponse } from 'next/server'

// Check if database is available
let prisma = null;
try {
  const { prisma: prismaClient } = require('../../../src/lib/prisma');
  prisma = prismaClient;
} catch (error) {
  console.log('Database not available, using fallback mode');
}

// GitHub API crawler
async function updateGitHubStats() {
  try {
    const username = 'kaylode';
    const token = process.env.GITHUB_TOKEN;
    
    const headers = token ? { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    } : {};
    
    // Get user info
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userResponse.ok) throw new Error('Failed to fetch user data');
    const userData = await userResponse.json();
    
    // Get repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
    const repos = await reposResponse.json();
    
    // Calculate stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    // Get language stats from top repositories
    const languages = {};
    const publicRepos = repos.filter(repo => !repo.private);
    
    for (const repo of publicRepos.slice(0, 20)) {
      try {
        const langResponse = await fetch(repo.languages_url, { headers });
        if (langResponse.ok) {
          const repoLangs = await langResponse.json();
          for (const [lang, bytes] of Object.entries(repoLangs)) {
            languages[lang] = (languages[lang] || 0) + bytes;
          }
        }
      } catch (error) {
        console.log(`Error fetching languages for ${repo.name}:`, error.message);
      }
    }
    
    // Convert language bytes to percentages
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const languagePercentages = {};
    Object.entries(languages).forEach(([lang, bytes]) => {
      languagePercentages[lang] = Math.round((bytes / totalBytes) * 100);
    });
    
    // Get top repositories
    const topRepos = publicRepos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        updatedAt: repo.updated_at
      }));
    
    // Prepare stats data
    const statsData = {
      username,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      totalForks,
      totalCommits: 0, // We'll need to calculate this separately if needed
      contributionsLastYear: 0, // This requires GitHub GraphQL API
      languages: languagePercentages,
      topRepositories: topRepos,
      lastUpdated: new Date()
    };

    // Update database if available
    let updatedStats = statsData;
    if (prisma) {
      try {
        updatedStats = await prisma.gitHubStats.upsert({
          where: { username },
          create: statsData,
          update: {
            publicRepos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            totalStars,
            totalForks,
            languages: languagePercentages,
            topRepositories: topRepos,
            lastUpdated: new Date()
          }
        });
      } catch (dbError) {
        console.error('Database error, returning live data:', dbError.message);
      }
    }
    
    return { success: true, data: updatedStats };
  } catch (error) {
    console.error('Error updating GitHub stats:', error.message);
    return { success: false, error: error.message };
  }
}

// LeetCode API crawler
async function updateLeetCodeStats() {
  try {
    const username = 'kaylode';
    
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
    
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });
    
    if (!response.ok) throw new Error('Failed to fetch LeetCode data');
    const data = await response.json();
    
    if (data.data && data.data.matchedUser) {
      const userData = data.data.matchedUser;
      const submitStats = userData.submitStats.acSubmissionNum;
      
      const easySolved = submitStats.find(s => s.difficulty === 'Easy')?.count || 0;
      const mediumSolved = submitStats.find(s => s.difficulty === 'Medium')?.count || 0;
      const hardSolved = submitStats.find(s => s.difficulty === 'Hard')?.count || 0;
      const totalSolved = easySolved + mediumSolved + hardSolved;
      
      // Prepare stats data
      const statsData = {
        username,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        ranking: userData.profile?.ranking || 0,
        lastUpdated: new Date()
      };

      // Update database if available
      let updatedStats = statsData;
      if (prisma) {
        try {
          updatedStats = await prisma.leetCodeStats.upsert({
            where: { username },
            create: statsData,
            update: {
              totalSolved,
              easySolved,
              mediumSolved,
              hardSolved,
              ranking: userData.profile?.ranking || 0,
              lastUpdated: new Date()
            }
          });
        } catch (dbError) {
          console.error('Database error, returning live data:', dbError.message);
        }
      }
      
      return { success: true, data: updatedStats };
    } else {
      throw new Error('User not found on LeetCode');
    }
  } catch (error) {
    console.error('Error updating LeetCode stats:', error.message);
    return { success: false, error: error.message };
  }
}

export async function POST() {
  try {
    console.log('Starting data update...');
    
    const [githubResult, leetcodeResult] = await Promise.allSettled([
      updateGitHubStats(),
      updateLeetCodeStats()
    ]);
    
    const results = {
      github: githubResult.status === 'fulfilled' ? githubResult.value : { success: false, error: githubResult.reason?.message },
      leetcode: leetcodeResult.status === 'fulfilled' ? leetcodeResult.value : { success: false, error: leetcodeResult.reason?.message }
    };
    
    return NextResponse.json({
      message: 'Data update completed',
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update stats error:', error);
    return NextResponse.json(
      { error: 'Failed to update stats', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to trigger data update',
    endpoints: {
      update: 'POST /api/update-stats',
      github: 'GET /api/github',
      leetcode: 'GET /api/leetcode',
      commits: 'GET /api/github/commits'
    }
  });
}
