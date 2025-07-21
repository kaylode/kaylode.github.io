#!/usr/bin/env node

const { syncAllData } = require('./sync-database-to-static.js');
const { crawlAllData, crawlGitHubStats, crawlLeetCodeStats } = require('./crawl-data.js');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'sync':
      console.log('🚀 Starting manual database sync...');
      try {
        const result = await syncAllData();
        if (result.success) {
          console.log('✅ Sync completed successfully!');
          process.exit(0);
        } else {
          console.log('❌ Sync completed with errors');
          process.exit(1);
        }
      } catch (error) {
        console.error('💥 Sync failed:', error.message);
        process.exit(1);
      }
      break;

    case 'crawl':
      const crawlTarget = args[1] || 'all';
      console.log(`📡 Starting data crawl (${crawlTarget})...`);
      try {
        switch (crawlTarget) {
          case 'github':
            await crawlGitHubStats();
            break;
          case 'leetcode':
            await crawlLeetCodeStats();
            break;
          case 'all':
          default:
            await crawlAllData();
            break;
        }
        console.log('✅ Crawl completed successfully!');
        
        // Auto-sync after crawling
        console.log('🔄 Auto-syncing to static files...');
        const result = await syncAllData();
        if (result.success) {
          console.log('✅ Full crawl + sync completed!');
          process.exit(0);
        } else {
          console.log('❌ Crawl succeeded but sync had errors');
          process.exit(1);
        }
      } catch (error) {
        console.error('💥 Crawl failed:', error.message);
        process.exit(1);
      }
      break;

    case 'status':
      console.log('📊 Checking sync status...');
      try {
        const fs = require('fs').promises;
        const path = require('path');
        const statusFile = path.join(__dirname, '../.sync-status.json');
        
        try {
          const content = await fs.readFile(statusFile, 'utf8');
          const status = JSON.parse(content);
          
          console.log('Last Sync:', status.syncTime);
          console.log('Success:', status.success);
          console.log('Duration:', status.duration + 'ms');
          console.log('Stats:', status.stats);
          
          if (status.errors && status.errors.length > 0) {
            console.log('Errors:', status.errors);
          }
        } catch (fileError) {
          console.log('No sync status found. Run "npm run sync" first.');
        }
      } catch (error) {
        console.error('Error checking status:', error.message);
        process.exit(1);
      }
      break;

    case 'help':
    default:
      console.log(`
📦 Portfolio Data Sync CLI

Usage:
  npm run data:sync         - Sync database to static files
  npm run data:crawl [type] - Crawl API data and sync to static files
  npm run data:status       - Check last sync status  
  npm run data:help         - Show this help message

Commands:
  sync                      - Sync existing database data to static files
  crawl [all|github|leetcode] - Fetch fresh data from APIs then sync
  status                    - Check last sync status and statistics
  help                      - Show this help message

Crawl Options:
  npm run data:crawl        - Crawl all APIs (GitHub + LeetCode) and sync
  npm run data:crawl github - Crawl only GitHub data and sync
  npm run data:crawl leetcode - Crawl only LeetCode data and sync

Purpose:
  This tool manages your portfolio data by:
  1. Crawling fresh data from GitHub and LeetCode APIs
  2. Storing it in your cloud PostgreSQL database
  3. Syncing database content to static files for offline fallback

Data synced:
  • Projects (from database)
  • Publications (from database)
  • Experiences & Education (from database)
  • Technologies (from database)
  • Achievements (from database)
  • Blog Posts (from database)
  • GitHub Stats (from GitHub API)
  • LeetCode Stats (from LeetCode API)

Output:
  Static files are written to src/data/ directory
      `);
      break;
  }
}

main().catch(console.error);
