'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaExternalLinkAlt, 
  FaCalendar, 
  FaUsers, 
  FaBookOpen,
  FaDownload,
  FaQuoteLeft,
  FaTimes,
  FaSortAmountDown,
  FaSortAmountUp
} from 'react-icons/fa';
import { SiGooglescholar, SiOrcid } from 'react-icons/si';
import AuthorNames from './utils/text';
import '../styles/modern-home.css';

const PublicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [publications, setPublications] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications');
        const data = await response.json();
        setPublications(data);
      } catch (error) {
        console.error('Failed to fetch publications:', error);
        // Fallback to static data
        try {
          const { publications_list } = await import('../data/publications');
          setPublications(publications_list);
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  // Get venue color based on venue type
  const getVenueColor = (venue) => {
    if (!venue) return 'text-gray-400';
    
    const venueUpper = venue.toUpperCase();
    if (venueUpper.includes('CVPR') || venueUpper.includes('ICCV') || venueUpper.includes('ECCV')) {
      return 'text-red-400'; // Top-tier computer vision conferences
    } else if (venueUpper.includes('ICLR') || venueUpper.includes('NIPS') || venueUpper.includes('ICML')) {
      return 'text-purple-400'; // Top-tier ML conferences
    } else if (venueUpper.includes('AAAI') || venueUpper.includes('IJCAI')) {
      return 'text-green-400'; // AI conferences
    } else if (venueUpper.includes('WORKSHOP') || venueUpper.includes('CHALLENGE')) {
      return 'text-yellow-400'; // Workshops and challenges
    } else if (venueUpper.includes('JOURNAL') || venueUpper.includes('IEEE') || venueUpper.includes('ACM')) {
      return 'text-cyan-400'; // Journals
    } else {
      return 'text-blue-400'; // Default
    }
  };

  // Get category color based on category type
  const getCategoryColor = (category) => {
    const categoryColors = {
      'Computer Vision': 'bg-blue-100 text-blue-800 border-blue-200',
      'Deep Learning': 'bg-purple-100 text-purple-800 border-purple-200',
      'Medical AI': 'bg-green-100 text-green-800 border-green-200',
      'Adversarial Attacks': 'bg-red-100 text-red-800 border-red-200',
      'Privacy Protection': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Image Quality': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Facial Recognition': 'bg-pink-100 text-pink-800 border-pink-200',
      '3D Computer Vision': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Shape Retrieval': 'bg-teal-100 text-teal-800 border-teal-200',
      'Cultural Heritage': 'bg-amber-100 text-amber-800 border-amber-200',
      'MeshNet': 'bg-lime-100 text-lime-800 border-lime-200',
      'Knowledge Distillation': 'bg-violet-100 text-violet-800 border-violet-200',
      'Dataset Creation': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Healthcare': 'bg-rose-100 text-rose-800 border-rose-200',
      'Object Detection': 'bg-orange-100 text-orange-800 border-orange-200',
      'RGB-D Data': 'bg-slate-100 text-slate-800 border-slate-200',
      'Road Analysis': 'bg-zinc-100 text-zinc-800 border-zinc-200',
      'Video Retrieval': 'bg-sky-100 text-sky-800 border-sky-200',
      'Text-Video Matching': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
      'Traffic Analysis': 'bg-neutral-100 text-neutral-800 border-neutral-200',
      'Multimodal Learning': 'bg-stone-100 text-stone-800 border-stone-200',
      'Semi-supervised Learning': 'bg-red-100 text-red-800 border-red-200',
      '3D Segmentation': 'bg-blue-100 text-blue-800 border-blue-200',
      'Uncertainty Estimation': 'bg-green-100 text-green-800 border-green-200',
      'Video Object Segmentation': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Flatten publications and add year to each publication
  const allPublications = useMemo(() => {
    const flattened = [];
    Object.entries(publications).forEach(([year, publicationsArray]) => {
      publicationsArray.forEach(pub => {
        flattened.push({ 
          ...pub, 
          year: parseInt(year),
          // Map database fields to expected format
          name: pub.title || pub.name,
          site: pub.venue || pub.site,
          link: pub.pdfUrl || pub.link,
          description: pub.abstract || pub.description,
          authors: Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors
        });
      });
    });
    return flattened;
  }, [publications]);

  // Get unique years and venues for filters
  const years = useMemo(() => {
    return [...new Set(allPublications.map(pub => pub.year))].sort((a, b) => b - a);
  }, [allPublications]);

  const venues = useMemo(() => {
    return [...new Set(allPublications.map(pub => pub.site))].filter(venue => venue);
  }, [allPublications]);

  const categories = useMemo(() => {
    const allCategories = [];
    allPublications.forEach(pub => {
      if (pub.categories) {
        allCategories.push(...pub.categories);
      }
    });
    return [...new Set(allCategories)].sort();
  }, [allPublications]);

  // Filter and sort publications
  const filteredPublications = useMemo(() => {
    let filtered = allPublications.filter(pub => {
      const matchesSearch = pub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pub.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'all' || pub.year === parseInt(selectedYear);
      const matchesVenue = selectedVenue === 'all' || pub.site === selectedVenue;
      const matchesCategory = selectedCategory === 'all' || 
                             (pub.categories && pub.categories.includes(selectedCategory));
      
      return matchesSearch && matchesYear && matchesVenue && matchesCategory;
    });

    // Sort by year
    filtered.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.year - a.year;
      } else {
        return a.year - b.year;
      }
    });

    return filtered;
  }, [allPublications, searchTerm, selectedYear, selectedVenue, selectedCategory, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('all');
    setSelectedVenue('all');
    setSelectedCategory('all');
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

  const PublicationCard = ({ publication }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedPublication(publication)}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-400/30">
          {publication.year}
        </span>
        <span className={`text-sm font-medium ${getVenueColor(publication.site)}`}>
          {publication.site}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-blue-300 transition-colors">
        {publication.name}
      </h3>

      <div className="mb-4">
        <AuthorNames text={publication.authors} shouldBeBold="Minh-Khoi Pham" />
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {publication.description}
      </p>

      {/* Category chips */}
      {publication.categories && publication.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {publication.categories.map((category, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}
            >
              {category}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center">
            <FaUsers className="mr-1" />
            {publication.authors.split(',').length} authors
          </span>
          <span className="flex items-center">
            <FaCalendar className="mr-1" />
            {publication.year}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-500/20 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <FaExternalLinkAlt />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );

  const PublicationModal = ({ publication, onClose }) => (
    <AnimatePresence>
      {publication && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="bg-gray-900 border border-white/20 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-4 py-2 rounded-full text-lg font-medium border border-blue-400/30">
                {publication.year}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              {publication.name}
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Authors</h3>
              <div className="text-gray-300 text-lg">
                <AuthorNames text={publication.authors} shouldBeBold="Minh-Khoi Pham" />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Published In</h3>
              <p className={`text-lg font-medium ${getVenueColor(publication.site)}`}>{publication.site}</p>
            </div>

            {publication.categories && publication.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Research Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {publication.categories.map((category, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {publication.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">Abstract</h3>
                <div className="bg-white/5 rounded-lg p-4 border-l-4 border-blue-400">
                  <FaQuoteLeft className="text-blue-400 mb-2" />
                  <p className="text-gray-300 leading-relaxed">{publication.description}</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <motion.a
                href={publication.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <FaExternalLinkAlt />
                View Paper
              </motion.a>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <FaDownload />
                Download PDF
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Publications
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Research contributions in AI, Deep Learning and Machine Learning
          </p>
          
          {/* Academic Profile Links */}
          <div className="flex justify-center space-x-6 mb-8">
                        <a
              href="https://scholar.google.com/citations?user=XLaKjh4AAAAJ&hl=en&oi=ao"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-all"
            >
              <SiGooglescholar size={20} />
              <span>Google Scholar</span>
            </a>
            <a
              href="https://orcid.org/0000-0003-3211-9076"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-all"
            >
              <SiOrcid size={20} />
              <span>ORCID</span>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-blue-300">{allPublications.length}</div>
              <div className="text-gray-300">Total Publications</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-green-300">{years.length}</div>
              <div className="text-gray-300">Years Active</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-purple-300">{venues.length}</div>
              <div className="text-gray-300">Different Venues</div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-xl text-gray-300">Loading publications...</p>
          </div>
        ) : (
          <>
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year} className="bg-gray-800">
                  {year}
                </option>
              ))}
            </select>

            {/* Venue Filter */}
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Venues</option>
              {venues.map(venue => (
                <option key={venue} value={venue} className="bg-gray-800">
                  {venue}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>

          {/* Active Filters & Clear */}
          <div className="flex flex-wrap items-center gap-2">
            {(searchTerm || selectedYear !== 'all' || selectedVenue !== 'all' || selectedCategory !== 'all') && (
              <>
                <span className="text-gray-300 text-sm">Active filters:</span>
                {searchTerm && (
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedYear !== 'all' && (
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">
                    Year: {selectedYear}
                  </span>
                )}
                {selectedVenue !== 'all' && (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                    Venue: {selectedVenue}
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-sm">
                    Category: {selectedCategory}
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
        <div className="text-gray-300 mb-6">
          Showing {filteredPublications.length} of {allPublications.length} publications
        </div>

        {/* Publications Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredPublications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPublications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FaBookOpen className="text-6xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No publications found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
        </>
        )}
      </div>

      {/* Publication Modal */}
      <PublicationModal 
        publication={selectedPublication} 
        onClose={() => setSelectedPublication(null)} 
      />
    </div>
  );
};

export default PublicationsPage;
