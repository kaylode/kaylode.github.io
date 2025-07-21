#!/usr/bin/env node

const { syncAllData } = require('./sync-database-to-static.js');

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
  npm run data:sync        - Sync database to static files
  npm run data:status      - Check last sync status  
  npm run data:help        - Show this help message

Purpose:
  This tool syncs your cloud PostgreSQL database content to static files,
  ensuring your app has fallback data if the database goes offline.

Data synced:
  • Projects
  • Publications  
  • Experiences
  • Education
  • Technologies
  • Achievements
  • Blog Posts

Output:
  Static files are written to src/data/ directory
      `);
      break;
  }
}

main().catch(console.error);
