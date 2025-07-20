'use client'

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaStar,
  FaEye,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCalendarAlt,
  FaCodeBranch
} from 'react-icons/fa';
import { project_list } from '../data/projects';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  // Color mapping for tags
  const getTagColors = (colorName) => {
    const colorMap = {
      'primary': 'bg-blue-500 bg-opacity-20 text-blue-400 border-blue-500',
      'secondary': 'bg-gray-500 bg-opacity-20 text-gray-400 border-gray-500',
      'success': 'bg-green-500 bg-opacity-20 text-green-400 border-green-500',
      'danger': 'bg-red-500 bg-opacity-20 text-red-400 border-red-500',
      'warning': 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500',
      'info': 'bg-cyan-500 bg-opacity-20 text-cyan-400 border-cyan-500',
      'light': 'bg-slate-500 bg-opacity-20 text-slate-400 border-slate-500',
      'dark': 'bg-stone-500 bg-opacity-20 text-stone-400 border-stone-500'
    };
    return colorMap[colorName] || colorMap['secondary'];
  };

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tags = new Set();
    project_list.forEach(project => {
      Object.keys(project.tags).forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter projects based on search and tag
  const filteredProjects = useMemo(() => {
    return project_list.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || Object.keys(project.tags).includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const ProjectCard = ({ project }) => (
    <motion.div
      variants={itemVariants}
      className="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => setSelectedProject(project)}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img 
          src={project.img} 
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 bg-opacity-80 p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub size={16} />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 bg-opacity-80 p-2 rounded-full text-white hover:bg-green-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt size={16} />
            </a>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span>{project.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCodeBranch />
              <span>{project.forks}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
          <span className={`inline-block w-3 h-3 rounded-full ${
            project.language === 'Python' ? 'bg-blue-500' :
            project.language === 'JavaScript' ? 'bg-yellow-500' :
            project.language === 'TypeScript' ? 'bg-blue-600' :
            project.language === 'C++' ? 'bg-pink-500' :
            'bg-gray-500'
          }`}></span>
          <span>{project.language}</span>
          {project.openIssues > 0 && (
            <span className="ml-auto text-red-400">
              {project.openIssues} issues
            </span>
          )}
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-3">
          {project.desc}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(project.tags).map(([tag, color]) => (
            <span
              key={tag}
              className={`px-2 py-1 text-xs rounded-full border border-opacity-30 ${getTagColors(color)}`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Updated {project.lastUpdated}</span>
          <div className="flex items-center gap-1">
            <FaCodeBranch size={12} />
            <span>{project.forks} forks</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ProjectModal = ({ project, onClose }) => (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={project.img} 
                alt={project.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                <div className="flex gap-4">
                  {project.source && (
                    <a
                      href={project.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                      <FaGithub />
                      View Source
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-700 hover:bg-green-600 px-4 py-2 rounded-lg text-white transition-colors"
                    >
                      <FaExternalLinkAlt />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <FaStar className="text-yellow-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-white">{project.stars}</div>
                  <div className="text-gray-400">Stars</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <FaCode className="text-blue-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-white">{project.forks}</div>
                  <div className="text-gray-400">Forks</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <FaEye className="text-green-400 mx-auto mb-2" size={24} />
                  <div className="text-2xl font-bold text-white">{project.openIssues}</div>
                  <div className="text-gray-400">Open Issues</div>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {project.desc}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {Object.entries(project.tags).map(([tag, color]) => (
                  <span
                    key={tag}
                    className={`px-3 py-2 text-sm rounded-full border border-opacity-30 ${getTagColors(color)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Last updated: {project.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    project.language === 'Python' ? 'bg-blue-500' :
                    project.language === 'JavaScript' ? 'bg-yellow-500' :
                    project.language === 'TypeScript' ? 'bg-blue-600' :
                    project.language === 'C++' ? 'bg-pink-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span>{project.language}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GitHub
            </span>{' '}
            Projects
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore my open-source contributions and innovative projects that showcase my development journey
          </p>
        </motion.div>
      </div>

      {/* Search and Filter Section */}
      <div className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Tag Filter */}
            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
              >
                <option value="">All Technologies</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Clear Filters */}
            {(searchTerm || selectedTag) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                }}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FaTimes />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
          
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaSearch className="mx-auto text-6xl text-gray-600 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default ProjectsPage;
