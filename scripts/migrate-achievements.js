/**
 * Script to migrate achievements data from static data to database
 */

import { PrismaClient } from '@prisma/client';
import { experiences_data } from '../src/data/experiences.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🏆 Starting achievements migration...');

  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Clear existing achievements
    await prisma.achievement.deleteMany();
    console.log('🧹 Cleared existing achievements');

    // Migrate achievements data
    let totalAchievements = 0;
    for (const achievementGroup of experiences_data.achievements) {
      console.log(`📋 Processing ${achievementGroup.title}...`);
      
      for (const item of achievementGroup.items) {
        await prisma.achievement.create({
          data: {
            category: achievementGroup.title,
            title: item.name,
            description: item.description,
            year: item.year,
            type: item.type,
            organization: extractOrganization(item.name, item.description),
            rank: extractRank(item.name),
            value: extractValue(item.name, item.description),
            url: null, // Can be added later
            image: null, // Can be added later
            isVisible: true,
            order: totalAchievements,
          }
        });
        totalAchievements++;
      }
    }

    console.log(`✅ Migrated ${totalAchievements} achievements`);

    // Show summary
    const achievementsByType = await prisma.achievement.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    });

    console.log('\n📊 Achievements by type:');
    for (const group of achievementsByType) {
      console.log(`  ${group.type}: ${group._count.id}`);
    }

    console.log('\n🎉 Achievements migration completed successfully!');

  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Helper functions to extract structured data from existing text
 */
function extractOrganization(name, description) {
  // Extract organization from achievement names and descriptions
  if (name.includes('MediaEval')) return 'MediaEval';
  if (name.includes('AI4VN')) return 'AI4VN';
  if (name.includes('Zalo AI Challenge')) return 'Zalo';
  if (name.includes('AI City Challenge')) return 'AI City Challenge';
  if (name.includes('AI Ho Chi Minh City Challenge')) return 'AI Ho Chi Minh City Challenge';
  if (name.includes('Panasonic')) return 'Panasonic';
  if (description.includes('HCMC Information and communication department')) return 'HCMC Information Department';
  return null;
}

function extractRank(name) {
  if (name.includes('1st Place') || name.includes('1st place')) return '1st Place';
  if (name.includes('Runner-up')) return 'Runner-up';
  if (name.includes('5th place')) return '5th Place';
  if (name.includes('Top 15')) return 'Top 15';
  return null;
}

function extractValue(name, description) {
  // Extract GPA or other quantifiable values
  if (description.includes('GPA: 9.123/10.0')) return '9.123/10.0 ~ 4.0/4.0';
  return null;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
