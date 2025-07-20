'use client'

import React, { useState, useMemo } from 'react';
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
import { blog_posts, blog_categories, blog_tags } from '../data/blog';
import '../styles/modern-home.css';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter posts based on search, category, tag, and featured status
  const filteredPosts = useMemo(() => {
    return blog_posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const matchesFeatured = !showFeaturedOnly || post.featured;
      
      return matchesSearch && matchesCategory && matchesTag && matchesFeatured;
    }).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [searchTerm, selectedCategory, selectedTag, showFeaturedOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedTag('');
    setShowFeaturedOnly(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Computer Vision': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'AI Security': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Web Development': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Healthcare AI': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Personal': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Research': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const BlogCard = ({ post }) => (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-blue-400/50 transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={() => setSelectedPost(post)}
    >
      {/* Post Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
        {post.featured && (
          <div className="absolute top-4 right-4">
            <FaStar className="text-yellow-400 text-lg" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
            {post.title}
          </h3>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs hover:bg-blue-500/20 hover:text-blue-300 transition-all cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTag(tag);
              }}
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{post.tags.length - 3} more</span>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center">
              <FaClock className="mr-1" />
              {post.readTime} min read
            </span>
          </div>
          <motion.div 
            className="flex items-center text-blue-400 group-hover:text-blue-300"
            whileHover={{ x: 5 }}
          >
            <span className="mr-2">Read more</span>
            <FaArrowRight />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );

  const BlogModal = ({ post, onClose }) => (
    <AnimatePresence>
      {post && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/20">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <FaTimes size={20} />
              </button>
              
              <div className="pr-12">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center">
                    <FaUser className="mr-2" />
                    {post.author}
                  </span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-2" />
                    {post.readTime} min read
                  </span>
                  {post.featured && (
                    <span className="flex items-center text-yellow-400">
                      <FaStar className="mr-2" />
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.replace(/\n/g, '<br />').replace(/#{1,6}\s/g, (match) => {
                      const level = match.length - 1;
                      return `<h${level} class="text-white font-bold mb-4 mt-6">`;
                    }).replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                  }}
                />
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h4 className="text-white font-semibold mb-3">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedTag(tag);
                        onClose();
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Blog & Insights
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sharing my thoughts on AI research, technology, and the journey of a Ph.D. student
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-12 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              {blog_categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="" className="bg-gray-800">All Tags</option>
              {blog_tags.map(tag => (
                <option key={tag} value={tag} className="bg-gray-800">
                  #{tag}
                </option>
              ))}
            </select>

            {/* Featured Toggle */}
            <label className="flex items-center space-x-3 px-4 py-3 bg-white/10 border border-white/20 rounded-lg cursor-pointer hover:bg-white/15 transition-all">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-400"
              />
              <span className="text-white flex items-center">
                <FaStar className="mr-2 text-yellow-400" />
                Featured Only
              </span>
            </label>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(searchTerm || selectedCategory !== 'All' || selectedTag || showFeaturedOnly) && (
              <>
                <span className="text-gray-300 text-sm">Active filters:</span>
                {searchTerm && (
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedTag && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                    Tag: #{selectedTag}
                  </span>
                )}
                {showFeaturedOnly && (
                  <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm">
                    Featured Only
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-red-400 hover:text-red-300 text-sm underline ml-2"
                >
                  Clear all
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="text-gray-300 mb-8">
          Showing {filteredPosts.length} of {blog_posts.length} posts
        </div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FaBookOpen className="mx-auto text-6xl text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No posts found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </motion.div>
        )}
      </div>

      {/* Blog Post Modal */}
      <BlogModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </div>
  );
};

export default BlogPage;
