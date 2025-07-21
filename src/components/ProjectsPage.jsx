'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaStar,
  FaEye,
  FaTimes,
  FaCalendarAlt,
  FaCodeBranch
} from 'react-icons/fa';

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        // Map database fields to expected format for ProjectsPage component
        const mappedProjects = data.map(project => {
          // Map project images to local assets
          let imagePath = '/projects/github.png'; // default fallback
          
          if (project.title.toLowerCase().includes('vehicle')) {
            imagePath = '/projects/vehicle_tracking.gif';
          } else if (project.title.toLowerCase().includes('theseus')) {
            imagePath = '/projects/github.png';
          } else if (project.title.toLowerCase().includes('aic') || project.title.toLowerCase().includes('traffic')) {
            imagePath = '/projects/aic22.png';
          } else if (project.title.toLowerCase().includes('meal') || project.title.toLowerCase().includes('food')) {
            imagePath = '/projects/food_api.jpg';
          } else if (project.title.toLowerCase().includes('ocr') || project.title.toLowerCase().includes('vietnamese')) {
            imagePath = '/projects/vnocrtoolbox.png';
          } else if (project.title.toLowerCase().includes('facemask')) {
            imagePath = '/projects/facemask.png';
          } else if (project.title.toLowerCase().includes('pothole')) {
            imagePath = '/projects/pothole.png';
          } else if (project.title.toLowerCase().includes('ivos') || project.title.toLowerCase().includes('organ')) {
            imagePath = '/projects/ivos.png';
          } else if (project.title.toLowerCase().includes('k.a.i') || project.title.toLowerCase().includes('discord')) {
            imagePath = '/projects/kai.jpg';
          } else if (project.title.toLowerCase().includes('picturetales')) {
            imagePath = '/projects/picturetales.png';
          }

          return {
            id: project.id,
            title: project.title,
            desc: project.description,
            img: imagePath, // Use local image path
            image: imagePath, // Keep both for compatibility
            source: project.githubUrl || '#',
            demo: project.liveUrl || '',
            github: project.githubUrl || '',
            live: project.liveUrl || '',
            stars: project.stars || 0,
            forks: project.forks || 0,
            language: project.language || 'Unknown',
            featured: project.featured || false,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            tags: project.technologies ? project.technologies.reduce((acc, tech) => {
              acc[tech] = 'secondary'; // default color for tech tags
              return acc;
            }, {}) : {},
            technologies: project.technologies || []
          };
        });
        
        setProjects(mappedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to static data
        try {
          const { project_list } = await import('../data/projects');
          setProjects(project_list);
        } catch (fallbackError) {
          console.error('Failed to load fallback data:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
    projects.forEach(project => {
      if (project.tags) {
        Object.keys(project.tags).forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [projects]);

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
          alt={`${project.title} project screenshot`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/projects/github.png'; // Fallback to default image
          }}
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
                alt={`${project.title} project screenshot`}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = '/projects/github.png'; // Fallback to default image
                }}
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl text-gray-300">Loading projects...</p>
        </div>
      ) : (
        <>

      {/* Content Section */}
      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
          
          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <FaCode className="mx-auto text-6xl text-gray-600 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Failed to load projects from database</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
      </>
      )}
    </div>
  );
};

export default ProjectsPage;
