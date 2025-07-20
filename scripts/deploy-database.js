#!/usr/bin/env node

/**
 * Database Deployment Script
 * 
 * This script helps deploy the database schema and populate initial data
 * after setting up Google Cloud PostgreSQL.
 * 
 * Usage:
 * 1. Set up your Google Cloud PostgreSQL instance
 * 2. Add DATABASE_URL to your .env file
 * 3. Run: node scripts/deploy-database.js
 */

const { PrismaClient } = require('@prisma/client')

async function deployDatabase() {
  console.log('🚀 Starting database deployment...')
  
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set')
      console.log('Please add your Google Cloud PostgreSQL connection string to .env file')
      console.log('Example: DATABASE_URL="postgresql://username:password@host:5432/database"')
      process.exit(1)
    }

    const prisma = new PrismaClient()
    
    // Test database connection
    console.log('🔌 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Deploy schema (in production, you'd run `prisma db push` or migrations)
    console.log('📋 Database schema should be deployed using: npm run db:push')
    
    // Check if tables exist by trying to count records
    try {
      const blogPostCount = await prisma.blogPost.count()
      const fileCount = await prisma.fileStorage.count()
      const analyticsCount = await prisma.analytics.count()
      
      console.log('📊 Current database state:')
      console.log(`   - Blog posts: ${blogPostCount}`)
      console.log(`   - Files: ${fileCount}`)
      console.log(`   - Analytics records: ${analyticsCount}`)
      
    } catch (error) {
      console.log('⚠️  Some tables may not exist yet. Run: npm run db:push')
    }

    // Create sample data if database is empty
    const shouldCreateSample = process.argv.includes('--sample')
    if (shouldCreateSample) {
      console.log('📝 Creating sample data...')
      await createSampleData(prisma)
    }

    await prisma.$disconnect()
    console.log('✅ Database deployment check complete!')
    
  } catch (error) {
    console.error('❌ Database deployment failed:', error.message)
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Connection troubleshooting:')
      console.log('1. Verify your Google Cloud SQL instance is running')
      console.log('2. Check that your IP is in authorized networks')
      console.log('3. Confirm DATABASE_URL format is correct')
      console.log('4. Test connection with: psql "your-database-url"')
    }
    
    process.exit(1)
  }
}

async function createSampleData(prisma) {
  try {
    // Create a sample blog post
    const samplePost = await prisma.blogPost.create({
      data: {
        title: 'Welcome to My Blog',
        slug: 'welcome-to-my-blog',
        excerpt: 'This is the first post on my new blog powered by Google Cloud PostgreSQL.',
        content: '# Welcome!\n\nThis blog is now powered by a real database! You can create, edit, and manage posts through the admin interface.\n\n## Features\n\n- Database-backed content\n- File attachments\n- Search and filtering\n- Analytics tracking',
        author: 'Your Name',
        publishedAt: new Date(),
        category: 'Technology',
        tags: ['database', 'blog', 'postgresql'],
        readTime: 2,
        featured: true,
        status: 'published'
      }
    })
    
    console.log(`✅ Created sample blog post: ${samplePost.title}`)
    
    // Create sample file storage record
    const sampleFile = await prisma.fileStorage.create({
      data: {
        filename: 'sample-resume.pdf',
        originalName: 'My Resume.pdf',
        mimeType: 'application/pdf',
        size: 1024000, // 1MB
        path: '/files/sample-resume.pdf',
        category: 'pdf',
        description: 'Sample resume file',
        isPublic: true
      }
    })
    
    console.log(`✅ Created sample file record: ${sampleFile.originalName}`)
    
  } catch (error) {
    console.error('Error creating sample data:', error.message)
  }
}

// Run the deployment
if (require.main === module) {
  deployDatabase()
}

module.exports = { deployDatabase }
