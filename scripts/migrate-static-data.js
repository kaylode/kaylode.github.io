const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

// Import static data
const { project_list } = require('../src/data/projects.js');
const { publications_list } = require('../src/data/publications.js');
const { experiences_data } = require('../src/data/experiences.js');

// Import techs with a more flexible approach
let techs_list = [];
try {
  const techsModule = require('../src/data/techs.js');
  techs_list = techsModule.techs || techsModule.techs_list || techsModule.default || [];
} catch (error) {
  console.warn('Could not load techs data:', error.message);
}

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database migration with static data...');

  try {
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await prisma.projectFile.deleteMany();
    await prisma.blogPostFile.deleteMany();
    await prisma.project.deleteMany();
    await prisma.publication.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.technology.deleteMany();

    // 1. Migrate Projects
    console.log('📂 Migrating projects...');
    const projectPromises = project_list.map(async (project, index) => {
      return await prisma.project.create({
        data: {
          title: project.title,
          description: project.desc,
          technologies: Object.keys(project.tags || {}),
          githubUrl: project.source,
          liveUrl: project.demo || null,
          image: project.img,
          featured: index < 3, // First 3 projects as featured
          stars: project.stars || 0,
          forks: project.forks || 0,
          language: project.language || null,
        }
      });
    });
    await Promise.all(projectPromises);
    console.log(`✅ Migrated ${project_list.length} projects`);

    // 2. Migrate Publications
    console.log('📚 Migrating publications...');
    let publicationCount = 0;
    for (const [year, publications] of Object.entries(publications_list)) {
      const publicationPromises = publications.map(async (pub) => {
        return await prisma.publication.create({
          data: {
            title: pub.name,
            authors: pub.authors.split(', '),
            venue: pub.site,
            year: parseInt(year),
            pdfUrl: pub.link,
            category: pub.categories ? pub.categories[0] : 'Research',
            abstract: pub.description || null,
            citations: 0, // Will be updated later via API
          }
        });
      });
      await Promise.all(publicationPromises);
      publicationCount += publications.length;
    }
    console.log(`✅ Migrated ${publicationCount} publications`);

    // 3. Migrate Education
    console.log('🎓 Migrating education data...');
    const educationPromises = experiences_data.education.map(async (edu, index) => {
      return await prisma.education.create({
        data: {
          institution: edu.institution,
          location: edu.location,
          degree: edu.degree,
          field: edu.field,
          period: edu.period,
          status: edu.status,
          gpa: edu.gpa || null,
          description: edu.description,
          highlights: edu.highlights || [],
          type: edu.type,
          order: index,
          isVisible: true,
        }
      });
    });
    await Promise.all(educationPromises);
    console.log(`✅ Migrated ${experiences_data.education.length} education records`);

    // 4. Migrate Professional Experience
    console.log('💼 Migrating professional experience...');
    const experiencePromises = experiences_data.professional.map(async (exp, index) => {
      return await prisma.experience.create({
        data: {
          company: exp.company,
          position: exp.position,
          location: exp.location || null,
          period: exp.period,
          type: exp.type || 'professional',
          description: exp.description || null,
          responsibilities: exp.responsibilities || [],
          achievements: exp.achievements || [],
          technologies: exp.technologies || [],
          isCurrent: exp.period.includes('Present'),
          order: index,
          isVisible: true,
        }
      });
    });
    await Promise.all(experiencePromises);
    console.log(`✅ Migrated ${experiences_data.professional.length} professional experiences`);

    // 5. Migrate Technologies
    console.log('🛠️ Migrating technologies...');
    if (techs_list && techs_list.length > 0) {
      const technologyPromises = techs_list.map(async (tech, index) => {
        return await prisma.technology.create({
          data: {
            name: tech.title || tech.name,
            category: tech.category || 'tools',
            icon: tech.src || tech.image || null,
            description: tech.description || null,
            proficiency: 'intermediate', // Default proficiency
            isVisible: true,
            order: index,
            color: tech.style || tech.color || null,
          }
        });
      });
      await Promise.all(technologyPromises);
      console.log(`✅ Migrated ${techs_list.length} technologies`);
    } else {
      console.log('⚠️ No technologies found to migrate');
    }

    // 6. Create sample blog posts
    console.log('📝 Creating sample blog posts...');
    const samplePosts = [
      {
        title: "Getting Started with Next.js and PostgreSQL",
        slug: "nextjs-postgresql-guide",
        excerpt: "A comprehensive guide to building modern web applications with Next.js and PostgreSQL database integration.",
        content: "# Getting Started with Next.js and PostgreSQL\n\nThis is a comprehensive guide...",
        author: "Kaylode",
        publishedAt: new Date('2024-01-15'),
        category: "Web Development",
        tags: ["NextJS", "PostgreSQL", "React", "Database"],
        readTime: 8,
        featured: true,
      },
      {
        title: "Machine Learning in Computer Vision",
        slug: "ml-computer-vision",
        excerpt: "Exploring the latest developments in machine learning applications for computer vision tasks.",
        content: "# Machine Learning in Computer Vision\n\nComputer vision has seen remarkable progress...",
        author: "Kaylode",
        publishedAt: new Date('2024-02-10'),
        category: "AI/ML",
        tags: ["Machine Learning", "Computer Vision", "Deep Learning", "AI"],
        readTime: 12,
        featured: true,
      },
      {
        title: "Building Scalable APIs with Node.js",
        slug: "scalable-nodejs-apis",
        excerpt: "Best practices for designing and implementing scalable REST APIs using Node.js and Express.",
        content: "# Building Scalable APIs with Node.js\n\nCreating robust and scalable APIs...",
        author: "Kaylode",
        publishedAt: new Date('2024-03-05'),
        category: "Backend Development",
        tags: ["NodeJS", "API", "Backend", "Express"],
        readTime: 10,
        featured: false,
      }
    ];

    const blogPromises = samplePosts.map(async (post) => {
      return await prisma.blogPost.create({
        data: post
      });
    });
    await Promise.all(blogPromises);
    console.log(`✅ Created ${samplePosts.length} sample blog posts`);

    console.log('🎉 Database migration completed successfully!');
    
    // Print summary
    const summary = await getDatabaseSummary();
    console.log('\n📊 Database Summary:');
    console.log(`- Projects: ${summary.projects}`);
    console.log(`- Publications: ${summary.publications}`);
    console.log(`- Education: ${summary.education}`);
    console.log(`- Experience: ${summary.experience}`);
    console.log(`- Technologies: ${summary.technologies}`);
    console.log(`- Blog Posts: ${summary.blogPosts}`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function getDatabaseSummary() {
  const [projects, publications, education, experience, technologies, blogPosts] = await Promise.all([
    prisma.project.count(),
    prisma.publication.count(),
    prisma.education.count(),
    prisma.experience.count(),
    prisma.technology.count(),
    prisma.blogPost.count(),
  ]);

  return {
    projects,
    publications,
    education,
    experience,
    technologies,
    blogPosts,
  };
}

// Run migration if called directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { main, getDatabaseSummary };
