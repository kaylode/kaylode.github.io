import { NextResponse } from 'next/server'
import { format, subDays, parseISO } from 'date-fns'

async function fetchGitHubCommits() {
  try {
    const username = 'kaylode';
    const token = process.env.GITHUB_TOKEN;
    
    const headers = token ? { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    } : {};
    
    // Get user's repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
    const repos = await reposResponse.json();
    
    // Filter to public repos and get commits for each
    const publicRepos = repos.filter(repo => !repo.private && !repo.fork);
    const commitData = {};
    
    // Initialize past 365 days with 0 commits
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      commitData[date] = 0;
    }
    
    // Get commits from recent repositories (limit to avoid rate limiting)
    const recentRepos = publicRepos.slice(0, 10);
    
    for (const repo of recentRepos) {
      try {
        // Get commits from the past year
        const since = format(subDays(new Date(), 365), 'yyyy-MM-dd');
        const commitsUrl = `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&since=${since}T00:00:00Z&per_page=100`;
        
        const commitsResponse = await fetch(commitsUrl, { headers });
        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          
          commits.forEach(commit => {
            const commitDate = format(parseISO(commit.commit.author.date), 'yyyy-MM-dd');
            if (commitData.hasOwnProperty(commitDate)) {
              commitData[commitDate]++;
            }
          });
        }
      } catch (error) {
        console.log(`Error fetching commits for ${repo.name}:`, error.message);
      }
    }
    
    // Convert to array format expected by the heatmap
    return Object.entries(commitData).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return null;
  }
}

export async function GET() {
  try {
    const realCommitData = await fetchGitHubCommits();
    
    if (realCommitData) {
      return NextResponse.json(realCommitData);
    }
    
    // Fallback to mock data if real data fails
    // Generate mock commit activity data for the past 365 days
    const commitData = Array.from({ length: 365 }, (_, i) => {
      const date = format(subDays(new Date(), 365 - i), 'yyyy-MM-dd');
      
      // Generate realistic commit patterns (more on weekdays, clusters around certain periods)
      const dayOfWeek = subDays(new Date(), 365 - i).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let baseCount = 0;
      
      // Higher activity on weekdays
      if (!isWeekend) {
        baseCount = Math.floor(Math.random() * 8) + 1;
      } else {
        baseCount = Math.floor(Math.random() * 3);
      }
      
      // Simulate periods of high activity (project sprints)
      const sprintPeriods = [
        { start: 50, end: 80 },   // Recent sprint
        { start: 150, end: 170 }, // Medium-term project
        { start: 250, end: 280 }, // Earlier project
      ];
      
      for (const sprint of sprintPeriods) {
        if (i >= sprint.start && i <= sprint.end) {
          baseCount = Math.min(baseCount + Math.floor(Math.random() * 5) + 2, 15);
        }
      }
      
      return {
        date,
        count: baseCount,
      };
    });

    return NextResponse.json(commitData);
  } catch (error) {
    console.error('Error generating commit activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commit activity' },
      { status: 500 }
    )
  }
}
