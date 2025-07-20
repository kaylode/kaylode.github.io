#!/usr/bin/env node

/**
 * Blog Management Script
 * 
 * This script helps you manage your blog posts by:
 * 1. Adding new posts from markdown files
 * 2. Updating the blog.js data file
 * 3. Converting markdown to blog post format
 * 
 * Usage:
 * node scripts/manage-blog.js add path/to/your-post.md
 * node scripts/manage-blog.js list
 * node scripts/manage-blog.js clear
 */

const fs = require('fs');
const path = require('path');

// Blog data file path
const BLOG_DATA_PATH = path.join(__dirname, '../src/data/blog.js');
const BLOG_POSTS_DIR = path.join(__dirname, '../blog-posts');

// Ensure blog posts directory exists
if (!fs.existsSync(BLOG_POSTS_DIR)) {
  fs.mkdirSync(BLOG_POSTS_DIR, { recursive: true });
  console.log(`Created blog posts directory: ${BLOG_POSTS_DIR}`);
}

// Parse markdown frontmatter and content
function parseMarkdown(content) {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format. Please include frontmatter.');
  }
  
  const frontmatter = {};
  const frontmatterLines = match[1].split('\n');
  
  frontmatterLines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      
      // Handle arrays (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
      }
      // Handle booleans
      else if (value === 'true' || value === 'false') {
        value = value === 'true';
      }
      // Remove quotes from strings
      else if ((value.startsWith('"') && value.endsWith('"')) || 
               (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key.trim()] = value;
    }
  });
  
  return {
    frontmatter,
    content: match[2].trim()
  };
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Calculate reading time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Load existing blog data
function loadBlogData() {
  try {
    if (fs.existsSync(BLOG_DATA_PATH)) {
      const content = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
      // Extract the blog_posts array using regex
      const postsMatch = content.match(/export const blog_posts = (\[[\s\S]*?\]);/);
      if (postsMatch) {
        // Use eval to parse the array (be careful with this in production)
        return eval(postsMatch[1]);
      }
    }
  } catch (error) {
    console.warn('Could not load existing blog data:', error.message);
  }
  return [];
}

// Save blog data
function saveBlogData(posts) {
  const categories = [
    "All",
    "Research",
    "AI & Machine Learning", 
    "Computer Vision",
    "Healthcare AI",
    "Web Development",
    "Personal",
    "Academic"
  ];
  
  const tags = [...new Set(posts.flatMap(post => post.tags || []))];
  
  const content = `export const blog_posts = ${JSON.stringify(posts, null, 2)};

export const blog_categories = [
  ${categories.map(cat => `"${cat}"`).join(',\n  ')}
];

export const blog_tags = [
  ${tags.map(tag => `"${tag}"`).join(',\n  ')}
];

export default blog_posts;`;

  fs.writeFileSync(BLOG_DATA_PATH, content, 'utf8');
  console.log(`✅ Blog data saved to ${BLOG_DATA_PATH}`);
}

// Add a new blog post
function addBlogPost(markdownPath) {
  if (!fs.existsSync(markdownPath)) {
    console.error(`❌ File not found: ${markdownPath}`);
    return;
  }
  
  try {
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    const { frontmatter, content } = parseMarkdown(markdownContent);
    
    // Validate required fields
    if (!frontmatter.title) {
      throw new Error('Title is required in frontmatter');
    }
    
    const posts = loadBlogData();
    const nextId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    
    const newPost = {
      id: nextId,
      title: frontmatter.title,
      slug: frontmatter.slug || generateSlug(frontmatter.title),
      excerpt: frontmatter.excerpt || content.substring(0, 200) + '...',
      content: content,
      author: frontmatter.author || "Minh-Khoi Pham",
      publishedAt: frontmatter.publishedAt || new Date().toISOString().split('T')[0],
      updatedAt: frontmatter.updatedAt || new Date().toISOString().split('T')[0],
      category: frontmatter.category || "Research",
      tags: frontmatter.tags || [],
      readTime: frontmatter.readTime || calculateReadTime(content),
      featured: frontmatter.featured || false,
      image: frontmatter.image || null,
      status: frontmatter.status || "published"
    };
    
    posts.push(newPost);
    saveBlogData(posts);
    
    console.log(`✅ Added blog post: "${newPost.title}"`);
    console.log(`   Slug: ${newPost.slug}`);
    console.log(`   Category: ${newPost.category}`);
    console.log(`   Tags: ${newPost.tags.join(', ')}`);
    console.log(`   Read time: ${newPost.readTime} minutes`);
    
  } catch (error) {
    console.error(`❌ Error adding blog post: ${error.message}`);
  }
}

// List all blog posts
function listBlogPosts() {
  const posts = loadBlogData();
  
  if (posts.length === 0) {
    console.log('📝 No blog posts found.');
    return;
  }
  
  console.log(`📚 Found ${posts.length} blog post(s):\n`);
  
  posts.forEach(post => {
    console.log(`${post.id}. ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Category: ${post.category}`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Published: ${post.publishedAt}`);
    console.log(`   Featured: ${post.featured ? 'Yes' : 'No'}`);
    console.log('');
  });
}

// Clear all blog posts
function clearBlogPosts() {
  saveBlogData([]);
  console.log('🗑️  All blog posts cleared.');
}

// Create example markdown file
function createExample() {
  const exampleContent = `---
title: "My First Real Blog Post"
slug: "my-first-real-blog-post"
excerpt: "This is my first real blog post using the blog management system."
category: "Personal"
tags: ["Personal", "Blog", "First Post"]
featured: true
status: "published"
---

# My First Real Blog Post

Welcome to my blog! This is an example of how to create blog posts using markdown files.

## Getting Started

To create a new blog post:

1. Create a markdown file in the \`blog-posts\` directory
2. Add frontmatter with your post metadata
3. Write your content in markdown
4. Run the script to add it to your blog

## Markdown Features

You can use all standard markdown features:

- **Bold text**
- *Italic text*
- \`Code snippets\`
- [Links](https://example.com)

### Code Blocks

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## Conclusion

This is just the beginning of my blogging journey!
`;

  const examplePath = path.join(BLOG_POSTS_DIR, 'example-post.md');
  fs.writeFileSync(examplePath, exampleContent, 'utf8');
  console.log(`📝 Created example blog post: ${examplePath}`);
  console.log(`To add it to your blog, run: node scripts/manage-blog.js add ${examplePath}`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'add':
      if (!args[1]) {
        console.error('❌ Please provide a markdown file path');
        console.log('Usage: node scripts/manage-blog.js add path/to/post.md');
        return;
      }
      addBlogPost(args[1]);
      break;
      
    case 'list':
      listBlogPosts();
      break;
      
    case 'clear':
      clearBlogPosts();
      break;
      
    case 'example':
      createExample();
      break;
      
    default:
      console.log('📚 Blog Management Script');
      console.log('');
      console.log('Commands:');
      console.log('  add <file>    Add a blog post from markdown file');
      console.log('  list          List all blog posts');
      console.log('  clear         Clear all blog posts');
      console.log('  example       Create an example markdown file');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/manage-blog.js add blog-posts/my-post.md');
      console.log('  node scripts/manage-blog.js list');
      console.log('  node scripts/manage-blog.js example');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  addBlogPost,
  listBlogPosts,
  clearBlogPosts,
  parseMarkdown,
  generateSlug,
  calculateReadTime
};
