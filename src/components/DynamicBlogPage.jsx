'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendar, 
  FaClock, 
  FaTimes,
  FaSearch,
  FaChevronLeft,
  FaStar,
  FaCalendarAlt,
  FaArrowRight,
  FaUser,
  FaBookOpen
} from 'react-icons/fa';

const DynamicBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);
  const [tags, setTags] = useState([]);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/blog');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure data is an array
        const postsArray = Array.isArray(data) ? data : [];
        
        setPosts(postsArray);
        setFilteredPosts(postsArray);
        
        // Extract unique categories and tags
        const uniqueCategories = ['All', ...new Set(postsArray.map(post => post.category))];
        const uniqueTags = [...new Set(postsArray.flatMap(post => post.tags || []))];
        
        setCategories(uniqueCategories);
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Set empty arrays as fallback
        setPosts([]);
        setFilteredPosts([]);
        setCategories(['All']);
        setTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search and filters
  useEffect(() => {
    // Ensure posts is always an array
    let filtered = Array.isArray(posts) ? [...posts] : [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(post => 
        Array.isArray(post.tags) && post.tags.includes(selectedTag)
      );
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(post => post.featured === true);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory, selectedTag, showFeaturedOnly]);

  const BlogCard = ({ post }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative group"
      onClick={() => setSelectedPost(post)}
    >
      {post.featured && (
        <div className="absolute top-4 right-4 z-10">
          <FaStar className="text-yellow-400 text-xl" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      
      <div className="p-6 relative z-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
          <div className="flex items-center text-gray-400 text-sm">
            <FaCalendarAlt className="mr-1" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(post.tags) ? post.tags : []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTag(tag);
              }}
            >
              {tag}
            </span>
          ))}
          {(Array.isArray(post.tags) ? post.tags : []).length > 3 && (
            <span className="text-xs text-gray-400">+{post.tags.length - 3} more</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-sm">
            <FaClock className="mr-1" />
            {post.readTime} min read
          </div>
          <FaArrowRight className="text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </motion.div>
  );

  const BlogModal = ({ post, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-white">{post.title}</h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 text-gray-300">
            <div className="flex items-center gap-2">
              <FaUser />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{post.readTime} min read</span>
            </div>
            {post.featured && (
              <FaStar className="text-yellow-400" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {(Array.isArray(post.tags) ? post.tags : []).map((tag) => (
              <span
                key={tag}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
            <p className="text-white mt-4">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Blog
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on AI, research, and technology
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Tag Filter */}
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              {/* Featured Toggle */}
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <FaBookOpen className="text-yellow-400" />
                Featured Only
              </label>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory !== 'All' || selectedTag || showFeaturedOnly) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedTag('');
                    setShowFeaturedOnly(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>

          {/* Results Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <p className="text-gray-400">
              Showing {filteredPosts.length} of {posts.length} posts
            </p>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-xl">No posts found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog Modal */}
      <AnimatePresence>
        {selectedPost && (
          <BlogModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DynamicBlogPage;
