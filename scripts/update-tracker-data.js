/**
 * Data fetcher script to get real data from GitHub and LeetCode APIs
 * and store them in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GitHub API configuration
const GITHUB_USERNAME = 'kaylode';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add this to your .env file

// LeetCode API configuration  
const LEETCODE_USERNAME = 'kaylode'; // Replace with your LeetCode username

/**
 * Fetch GitHub statistics from GitHub API
 */
async function fetchGitHubStats() {
  try {
    console.log('Fetching GitHub stats...');
    
    const headers = {
      'User-Agent': 'Portfolio-App',
      ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` })
    };

    // Fetch user info
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers
    });
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
      headers
    });
    const reposData = await reposResponse.json();

    // Calculate statistics
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    // Get language statistics
    const languages = {};
    for (const repo of reposData.slice(0, 20)) { // Limit to top 20 repos to avoid rate limiting
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
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

    // Fetch commit activity for the last year
    let totalCommits = 0;
    try {
      const commitResponse = await fetch(`https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}+committer-date:>=${new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`, {
        headers: {
          ...headers,
          Accept: 'application/vnd.github.cloak-preview'
        }
      });
      const commitData = await commitResponse.json();
      totalCommits = commitData.total_count || 0;
    } catch (error) {
      console.warn('Could not fetch commit data:', error.message);
    }

    const stats = {
      username: GITHUB_USERNAME,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      totalForks,
      totalCommits,
      contributionsLastYear: totalCommits,
      languages: JSON.stringify(languages),
      topRepositories: JSON.stringify(topRepositories),
      lastUpdated: new Date()
    };

    console.log('GitHub stats fetched successfully:', stats);
    return stats;

  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
}

/**
 * Fetch LeetCode statistics from LeetCode API
 */
async function fetchLeetCodeStats() {
  try {
    console.log('Fetching LeetCode stats...');
    
    // LeetCode GraphQL API
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            userAvatar
            realName
            aboutMe
            school
            websites
            countryName
            company
            jobTitle
            skillTags
            postViewCount
            postViewCountDiff
            reputation
            reputationDiff
            solutionCount
            solutionCountDiff
            categoryDiscussCount
            categoryDiscussCountDiff
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

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`LeetCode API error: ${data.errors[0].message}`);
    }

    const user = data.data.matchedUser;
    if (!user) {
      throw new Error(`LeetCode user ${LEETCODE_USERNAME} not found`);
    }

    const submitStats = user.submitStats.acSubmissionNum;
    const easySolved = submitStats.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = submitStats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = submitStats.find(s => s.difficulty === 'Hard')?.count || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    // Calculate acceptance rate
    const totalSubmissions = submitStats.reduce((sum, s) => sum + s.submissions, 0);
    const acceptanceRate = totalSubmissions > 0 ? ((totalSolved / totalSubmissions) * 100).toFixed(1) : 0;

    const stats = {
      username: LEETCODE_USERNAME,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      acceptanceRate: parseFloat(acceptanceRate),
      ranking: user.profile.ranking || 0,
      contributionPoints: 0, // LeetCode doesn't provide this in public API
      contestRating: 0, // Would need additional API call
      contestParticipation: 0, // Would need additional API call
      recentSubmissions: JSON.stringify([]), // Would need additional API call
      lastUpdated: new Date()
    };

    console.log('LeetCode stats fetched successfully:', stats);
    return stats;

  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    throw error;
  }
}

/**
 * Fetch GitHub commit data for heatmap
 */
async function fetchGitHubCommits() {
  try {
    console.log('Fetching GitHub commits...');
    
    const headers = {
      'User-Agent': 'Portfolio-App',
      ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` })
    };

    const commits = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    // Generate dates for the last year
    for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      try {
        // Search for commits on this specific date
        const response = await fetch(
          `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}+committer-date:${dateStr}`, 
          {
            headers: {
              ...headers,
              Accept: 'application/vnd.github.cloak-preview'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          commits.push({
            date: dateStr,
            count: data.total_count || 0
          });
        } else {
          commits.push({
            date: dateStr,
            count: 0
          });
        }
        
        // Rate limiting: wait between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.warn(`Error fetching commits for ${dateStr}:`, error.message);
        commits.push({
          date: dateStr,
          count: 0
        });
      }
    }

    console.log(`Fetched ${commits.length} days of commit data`);
    return commits;

  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    throw error;
  }
}

/**
 * Store data in database
 */
async function storeGitHubStats(stats) {
  try {
    await prisma.gitHubStats.upsert({
      where: { username: stats.username },
      update: stats,
      create: stats
    });
    console.log('GitHub stats stored in database');
  } catch (error) {
    console.error('Error storing GitHub stats:', error);
    throw error;
  }
}

async function storeLeetCodeStats(stats) {
  try {
    await prisma.leetCodeStats.upsert({
      where: { username: stats.username },
      update: stats,
      create: stats
    });
    console.log('LeetCode stats stored in database');
  } catch (error) {
    console.error('Error storing LeetCode stats:', error);
    throw error;
  }
}

async function storeGitHubCommits(commits) {
  try {
    // Clear existing commits for this user
    await prisma.gitHubCommit.deleteMany({
      where: { username: GITHUB_USERNAME }
    });

    // Insert new commits
    await prisma.gitHubCommit.createMany({
      data: commits.map(commit => ({
        username: GITHUB_USERNAME,
        date: new Date(commit.date),
        count: commit.count
      }))
    });
    
    console.log(`Stored ${commits.length} commit records in database`);
  } catch (error) {
    console.error('Error storing GitHub commits:', error);
    throw error;
  }
}

/**
 * Main function to fetch and store all data
 */
export async function updateAllStats() {
  try {
    console.log('Starting data update process...');
    
    // Fetch all data
    const [githubStats, leetcodeStats, githubCommits] = await Promise.all([
      fetchGitHubStats(),
      fetchLeetCodeStats(),
      fetchGitHubCommits()
    ]);

    // Store all data
    await Promise.all([
      storeGitHubStats(githubStats),
      storeLeetCodeStats(leetcodeStats),
      storeGitHubCommits(githubCommits)
    ]);

    console.log('All stats updated successfully!');
    return {
      success: true,
      message: 'All stats updated successfully',
      data: {
        github: githubStats,
        leetcode: leetcodeStats,
        commits: githubCommits.length
      }
    };

  } catch (error) {
    console.error('Error updating stats:', error);
    return {
      success: false,
      message: error.message,
      error
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Export individual functions for testing
export {
  fetchGitHubStats,
  fetchLeetCodeStats,
  fetchGitHubCommits,
  storeGitHubStats,
  storeLeetCodeStats,
  storeGitHubCommits
};
