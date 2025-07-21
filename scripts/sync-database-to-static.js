const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

// Mapping of project images to their public paths
const PROJECT_IMAGE_MAPPING = {
  'github': '/projects/github.png',
  'theseus': '/projects/github.png',
  'facemask': '/projects/facemask.png',
  'face mask': '/projects/facemask.png',
  'vehicle tracking': '/projects/vehicle_tracking.gif',
  'vehicle': '/projects/vehicle_tracking.gif',
  'vnocr': '/projects/vnocrtoolbox.png',
  'ocr': '/projects/vnocrtoolbox.png',
  'kai': '/projects/kai.jpg',
  'pothole': '/projects/pothole.png',
  'traffic': '/projects/aic22.png',
  'aic22': '/projects/aic22.png',
  'food': '/projects/food_api.jpg',
  'api': '/projects/food_api.jpg',
  'ivos': '/projects/ivos.png',
  'picturetales': '/projects/picturetales.png',
};

// Function to map project image based on title or existing image
function mapProjectImage(project) {
  if (project.image && project.image.startsWith('/projects/')) {
    return project.image;
  }
  
  const title = project.title.toLowerCase();
  for (const [keyword, imagePath] of Object.entries(PROJECT_IMAGE_MAPPING)) {
    if (title.includes(keyword)) {
      return imagePath;
    }
  }
  
  return '/projects/github.png'; // Default fallback
}

// Check if database is available
async function isDatabaseAvailable() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  }
}

// Sync projects data
async function syncProjects() {
  console.log('📦 Syncing projects data...');
  
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { stars: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    const projectsData = projects.map((project, index) => ({
      id: index + 1,
      img: mapProjectImage(project),
      title: project.title,
      desc: project.description,
      demo: project.liveUrl || '',
      source: project.githubUrl || '',
      github: project.githubUrl || '',
      live: project.liveUrl || '',
      stars: project.stars || 0,
      forks: project.forks || 0,
      language: project.language || 'Unknown',
      featured: project.featured || false,
      createdAt: project.createdAt?.toISOString(),
      updatedAt: project.updatedAt?.toISOString(),
      color: 'light', // Default color for compatibility
      tags: project.technologies ? project.technologies.reduce((acc, tech) => {
        acc[tech] = 'secondary';
        return acc;
      }, {}) : {},
      technologies: project.technologies || []
    }));

    const fileContent = `// Import images from public directory for Next.js
const Github = "/projects/github.png"
const FaceMaskRemoval = "/projects/facemask.png"
const VehicleTracking = "/projects/vehicle_tracking.gif"
const VNOCRToolBox = "/projects/vnocrtoolbox.png"
const Kai = "/projects/kai.jpg"
const Pothole = "/projects/pothole.png"
const TrafficEventRetrieval = "/projects/aic22.png"
const FoodAPI = "/projects/food_api.jpg"
const IVOS = "/projects/ivos.png"

// Auto-generated from database sync on ${new Date().toISOString()}
// Last synced: ${projects.length} projects

// eslint-disable-next-line import/no-anonymous-default-export
export const project_list = ${JSON.stringify(projectsData, null, 2)};

export default project_list;
`;

    await fs.writeFile(
      path.join(__dirname, '../src/data/projects.js'),
      fileContent,
      'utf8'
    );
    
    console.log(`✅ Projects synced: ${projects.length} projects written to static file`);
    return projects.length;
  } catch (error) {
    console.error('❌ Error syncing projects:', error.message);
    throw error;
  }
}

// Sync publications data
async function syncPublications() {
  console.log('📚 Syncing publications data...');
  
  try {
    const publications = await prisma.publication.findMany({
      orderBy: [
        { year: 'desc' },
        { title: 'asc' }
      ]
    });

    const publicationsData = publications.map((pub, index) => ({
      id: index + 1,
      title: pub.title,
      authors: pub.authors,
      venue: pub.venue,
      year: pub.year,
      doi: pub.doi,
      arxivId: pub.arxivId,
      pdfUrl: pub.pdfUrl,
      category: pub.category,
      abstract: pub.abstract,
      citations: pub.citations || 0,
      type: pub.category || 'conference',
      url: pub.doi ? `https://doi.org/${pub.doi}` : pub.pdfUrl,
      arxiv: pub.arxivId ? `https://arxiv.org/abs/${pub.arxivId}` : null
    }));

    const fileContent = `// Auto-generated from database sync on ${new Date().toISOString()}
// Last synced: ${publications.length} publications

export const publications_list = ${JSON.stringify(publicationsData, null, 2)};

export default publications_list;
`;

    await fs.writeFile(
      path.join(__dirname, '../src/data/publications.js'),
      fileContent,
      'utf8'
    );
    
    console.log(`✅ Publications synced: ${publications.length} publications written to static file`);
    return publications.length;
  } catch (error) {
    console.error('❌ Error syncing publications:', error.message);
    throw error;
  }
}

// Sync experiences data (education + professional experience)
async function syncExperiences() {
  console.log('💼 Syncing experiences data...');
  
  try {
    const [education, experiences, achievements] = await Promise.all([
      prisma.education.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' }
      }),
      prisma.experience.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' }
      }),
      prisma.achievement.findMany({
        where: { isVisible: true },
        orderBy: [{ year: 'desc' }, { order: 'asc' }]
      })
    ]);

    // Group achievements by category
    const achievementsByCategory = achievements.reduce((acc, achievement) => {
      const category = achievement.category || 'academic';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        year: achievement.year,
        type: achievement.type,
        organization: achievement.organization,
        rank: achievement.rank,
        value: achievement.value,
        url: achievement.url,
        image: achievement.image
      });
      return acc;
    }, {});

    const experiencesData = {
      education: education.map(edu => ({
        id: edu.id,
        institution: edu.institution,
        location: edu.location,
        degree: edu.degree,
        field: edu.field,
        period: edu.period,
        status: edu.status,
        gpa: edu.gpa,
        description: edu.description,
        highlights: edu.highlights || [],
        logo: edu.logo,
        type: edu.type,
        startDate: edu.startDate?.toISOString(),
        endDate: edu.endDate?.toISOString()
      })),
      experience: experiences.map(exp => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        location: exp.location,
        period: exp.period,
        type: exp.type,
        description: exp.description,
        responsibilities: exp.responsibilities || [],
        achievements: exp.achievements || [],
        technologies: exp.technologies || [],
        logo: exp.logo,
        website: exp.website,
        startDate: exp.startDate?.toISOString(),
        endDate: exp.endDate?.toISOString(),
        isCurrent: exp.isCurrent
      })),
      achievements: achievementsByCategory
    };

    const fileContent = `// Auto-generated from database sync on ${new Date().toISOString()}
// Last synced: ${education.length} education entries, ${experiences.length} work experiences, ${achievements.length} achievements

export const experiences_data = ${JSON.stringify(experiencesData, null, 2)};

export default experiences_data;
`;

    await fs.writeFile(
      path.join(__dirname, '../src/data/experiences.js'),
      fileContent,
      'utf8'
    );
    
    console.log(`✅ Experiences synced: ${education.length} education + ${experiences.length} work + ${achievements.length} achievements written to static file`);
    return education.length + experiences.length + achievements.length;
  } catch (error) {
    console.error('❌ Error syncing experiences:', error.message);
    throw error;
  }
}

// Sync technologies data
async function syncTechnologies() {
  console.log('🔧 Syncing technologies data...');
  
  try {
    const technologies = await prisma.technology.findMany({
      where: { isVisible: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }]
    });

    const techsData = technologies.map(tech => ({
      id: tech.id,
      name: tech.name,
      category: tech.category,
      icon: tech.icon,
      description: tech.description,
      proficiency: tech.proficiency,
      yearStarted: tech.yearStarted,
      color: tech.color,
      order: tech.order
    }));

    const fileContent = `// Auto-generated from database sync on ${new Date().toISOString()}
// Last synced: ${technologies.length} technologies

export const techs_list = ${JSON.stringify(techsData, null, 2)};

export default techs_list;
`;

    await fs.writeFile(
      path.join(__dirname, '../src/data/techs.js'),
      fileContent,
      'utf8'
    );
    
    console.log(`✅ Technologies synced: ${technologies.length} technologies written to static file`);
    return technologies.length;
  } catch (error) {
    console.error('❌ Error syncing technologies:', error.message);
    throw error;
  }
}

// Sync blog posts data
async function syncBlogPosts() {
  console.log('📝 Syncing blog posts data...');
  
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: [{ publishedAt: 'desc' }],
      include: {
        blogPostFiles: {
          include: {
            file: true
          }
        }
      }
    });

    const blogData = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      publishedAt: post.publishedAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      category: post.category,
      tags: post.tags || [],
      readTime: post.readTime,
      featured: post.featured,
      image: post.image,
      views: post.views,
      files: post.blogPostFiles.map(bf => ({
        id: bf.file.id,
        filename: bf.file.filename,
        originalName: bf.file.originalName,
        mimeType: bf.file.mimeType,
        size: bf.file.size,
        path: bf.file.path,
        category: bf.file.category,
        description: bf.file.description
      }))
    }));

    const fileContent = `// Auto-generated from database sync on ${new Date().toISOString()}
// Last synced: ${blogPosts.length} blog posts

export const blog_posts = ${JSON.stringify(blogData, null, 2)};

export default blog_posts;
`;

    await fs.writeFile(
      path.join(__dirname, '../src/data/blog.js'),
      fileContent,
      'utf8'
    );
    
    console.log(`✅ Blog posts synced: ${blogPosts.length} posts written to static file`);
    return blogPosts.length;
  } catch (error) {
    console.error('❌ Error syncing blog posts:', error.message);
    throw error;
  }
}

// Main sync function
async function syncAllData() {
  console.log('🚀 Starting database to static files synchronization...');
  console.log('📅 Sync time:', new Date().toISOString());
  
  const startTime = Date.now();
  const results = {
    success: false,
    syncTime: new Date().toISOString(),
    duration: 0,
    stats: {},
    errors: []
  };

  try {
    // Check database availability
    const dbAvailable = await isDatabaseAvailable();
    if (!dbAvailable) {
      throw new Error('Database is not available. Cannot perform sync.');
    }

    // Sync all data types
    const syncOperations = [
      { name: 'projects', fn: syncProjects },
      { name: 'publications', fn: syncPublications },
      { name: 'experiences', fn: syncExperiences },
      { name: 'technologies', fn: syncTechnologies },
      { name: 'blogPosts', fn: syncBlogPosts }
    ];

    for (const operation of syncOperations) {
      try {
        const count = await operation.fn();
        results.stats[operation.name] = count;
      } catch (error) {
        console.error(`❌ Failed to sync ${operation.name}:`, error.message);
        results.errors.push(`${operation.name}: ${error.message}`);
      }
    }

    results.success = results.errors.length === 0;
    results.duration = Date.now() - startTime;

    console.log('\n📊 Sync Summary:');
    console.log('================');
    console.log(`✅ Success: ${results.success}`);
    console.log(`⏱️  Duration: ${results.duration}ms`);
    console.log('📈 Stats:');
    Object.entries(results.stats).forEach(([key, value]) => {
      console.log(`   ${key}: ${value} items`);
    });

    if (results.errors.length > 0) {
      console.log('❌ Errors:');
      results.errors.forEach(error => console.log(`   ${error}`));
    }

    // Create sync status file
    const statusFile = path.join(__dirname, '../.sync-status.json');
    await fs.writeFile(statusFile, JSON.stringify(results, null, 2), 'utf8');
    console.log(`📄 Sync status written to: ${statusFile}`);

    return results;

  } catch (error) {
    console.error('💥 Critical sync error:', error.message);
    results.success = false;
    results.duration = Date.now() - startTime;
    results.errors.push(`Critical error: ${error.message}`);
    return results;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI support
if (require.main === module) {
  syncAllData()
    .then((results) => {
      console.log('\n🎉 Sync completed!');
      process.exit(results.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Sync failed:', error);
      process.exit(1);
    });
}

module.exports = {
  syncAllData,
  syncProjects,
  syncPublications,
  syncExperiences,
  syncTechnologies,
  syncBlogPosts,
  isDatabaseAvailable
};
