'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaEye,
  FaTimes,
  FaMarkdown
} from 'react-icons/fa';

const BlogAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Research',
    tags: [],
    featured: false,
    status: 'draft'
  });

  const categories = [
    "Research",
    "AI & Machine Learning",
    "Computer Vision", 
    "Healthcare AI",
    "Web Development",
    "Personal",
    "Academic"
  ];

  const handleCreatePost = () => {
    const post = {
      ...newPost,
      id: Date.now(),
      author: "Minh-Khoi Pham",
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      readTime: Math.ceil(newPost.content.split(' ').length / 200), // estimate read time
      image: null
    };
    
    setPosts([...posts, post]);
    setNewPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Research',
      tags: [],
      featured: false,
      status: 'draft'
    });
    setIsCreating(false);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleTitleChange = (title) => {
    setNewPost({
      ...newPost,
      title,
      slug: generateSlug(title)
    });
  };

  const exportToBlogFile = () => {
    const blogFileContent = `export const blog_posts = ${JSON.stringify(posts, null, 2)};

export const blog_categories = [
  "All",
  ${categories.map(cat => `"${cat}"`).join(',\n  ')}
];

export const blog_tags = [
  ${[...new Set(posts.flatMap(post => post.tags))].map(tag => `"${tag}"`).join(',\n  ')}
];

export default blog_posts;`;

    const blob = new Blob([blogFileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Blog Admin
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Create and manage your blog posts
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            <span>New Post</span>
          </button>
          
          {posts.length > 0 && (
            <button
              onClick={exportToBlogFile}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaSave />
              <span>Export to blog.js</span>
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingPost) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isCreating ? 'Create New Post' : 'Edit Post'}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPost(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Slug (auto-generated) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={newPost.slug}
                  onChange={(e) => setNewPost({...newPost, slug: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="post-url-slug"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Brief description of the post..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FaMarkdown className="inline mr-2" />
                  Content (Markdown)
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={15}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 font-mono text-sm"
                  placeholder="# Your Post Title

Write your content in Markdown format...

## Section 1
Content here...

## Section 2
More content..."
                />
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPost.tags.join(', ')}
                    onChange={(e) => setNewPost({
                      ...newPost, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="AI, Machine Learning, Research"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={newPost.featured}
                    onChange={(e) => setNewPost({...newPost, featured: e.target.checked})}
                    className="rounded"
                  />
                  <span>Featured Post</span>
                </label>

                <select
                  value={newPost.status}
                  onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="draft" className="bg-gray-800">Draft</option>
                  <option value="published" className="bg-gray-800">Published</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                onClick={handleCreatePost}
                disabled={!newPost.title || !newPost.content}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <FaSave />
                <span>{isCreating ? 'Create Post' : 'Update Post'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts yet. Create your first blog post!</p>
            </div>
          ) : (
            posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-300 mb-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                        {post.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        post.status === 'published' 
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {post.status}
                      </span>
                      {post.featured && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {post.publishedAt} • {post.readTime} min read
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setNewPost(post);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setPosts(posts.filter(p => p.id !== post.id))}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-yellow-300 mb-3">How to use:</h3>
          <ol className="text-gray-300 space-y-2">
            <li>1. Click "New Post" to create a blog post</li>
            <li>2. Fill in the title, content (in Markdown), category, and tags</li>
            <li>3. Preview and save your posts</li>
            <li>4. Click "Export to blog.js" to download the updated blog data file</li>
            <li>5. Replace the content in <code className="bg-gray-800 px-2 py-1 rounded">src/data/blog.js</code> with the exported content</li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogAdmin;
