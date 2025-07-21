'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaBriefcase, 
  FaTrophy, 
  FaMapMarkerAlt,
  FaAward,
  FaMedal,
  FaChevronDown,
  FaChevronUp,
  FaCode,
  FaFlask,
  FaLaptopCode,
  FaMobile,
  FaTools,
  FaBook,
  FaBrain,
  FaCogs,
  FaStar,
  FaCertificate
} from 'react-icons/fa';
import { experiences_data } from '../data/experiences';
import { techs_list } from '../data/techs';
import '../styles/modern-home.css';

const ExperiencesPage = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('technical');
  const [dynamicExperiences, setDynamicExperiences] = useState([]);
  const [dynamicEducation, setDynamicEducation] = useState([]);
  const [dynamicAchievements, setDynamicAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fetch dynamic data from API
  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setLoading(true);
        const [experiencesResponse, educationResponse, achievementsResponse] = await Promise.all([
          fetch('/api/experiences'),
          fetch('/api/education'),
          fetch('/api/achievements')
        ]);
        
        if (experiencesResponse.ok) {
          const experiencesData = await experiencesResponse.json();
          setDynamicExperiences(experiencesData.filter(exp => exp.type === 'professional' && exp.isVisible));
        }
        
        if (educationResponse.ok) {
          const educationData = await educationResponse.json();
          setDynamicEducation(educationData.filter(edu => edu.isVisible));
        }

        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setDynamicAchievements(achievementsData.filter(achievement => achievement.isVisible));
        }
      } catch (error) {
        console.error('Error fetching dynamic data:', error);
        // Fallback to static data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine dynamic data with static data as fallback
  const combinedData = {
    ...experiences_data,
    education: dynamicEducation.length > 0 ? dynamicEducation.map(edu => ({
      id: edu.id,
      institution: edu.institution,
      location: edu.location,
      degree: edu.degree,
      field: edu.field,
      period: edu.period,
      status: edu.isCurrent ? 'Ongoing' : 'Completed',
      description: edu.description,
      gpa: edu.gpa,
      achievements: edu.achievements || [],
      coursework: edu.coursework || [],
      thesis: edu.thesis,
      advisor: edu.advisor,
      highlights: edu.highlights || []
    })) : experiences_data.education,
    professional: dynamicExperiences.length > 0 ? dynamicExperiences.map(exp => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location,
      period: exp.period,
      status: exp.isCurrent ? 'Current' : 'Completed',
      description: exp.description,
      responsibilities: exp.responsibilities || [],
      achievements: exp.achievements || [],
      technologies: exp.technologies || []
    })) : experiences_data.professional,
    achievements: dynamicAchievements.length > 0 ? (() => {
      // Transform database achievements into grouped structure
      const groupedAchievements = dynamicAchievements.reduce((acc, achievement) => {
        const existingGroup = acc.find(group => group.title === achievement.category);
        const transformedItem = {
          name: achievement.title,
          description: achievement.description,
          year: achievement.year,
          type: achievement.type,
          organization: achievement.organization,
          rank: achievement.rank,
          value: achievement.value,
          url: achievement.url,
          image: achievement.image
        };

        if (existingGroup) {
          existingGroup.items.push(transformedItem);
        } else {
          acc.push({
            id: acc.length + 1,
            title: achievement.category,
            items: [transformedItem]
          });
        }
        return acc;
      }, []);

      return groupedAchievements;
    })() : experiences_data.achievements
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

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'competition': return FaTrophy;
      case 'hackathon': return FaCode;
      case 'academic': return FaGraduationCap;
      case 'scholarship': return FaAward;
      case 'recognition': return FaCertificate;
      default: return FaMedal;
    }
  };

  const getAchievementColor = (type) => {
    switch (type) {
      case 'competition': return 'text-yellow-400 bg-yellow-400/20';
      case 'hackathon': return 'text-purple-400 bg-purple-400/20';
      case 'academic': return 'text-blue-400 bg-blue-400/20';
      case 'scholarship': return 'text-green-400 bg-green-400/20';
      case 'recognition': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getSkillIcon = (category) => {
    switch (category) {
      case 'Programming Languages': return FaCode;
      case 'AI & Machine Learning': return FaBrain;
      case 'Web Development': return FaLaptopCode;
      case 'Mobile Development': return FaMobile;
      case 'Tools & Platforms': return FaTools;
      case 'Research & Academic': return FaBook;
      default: return FaCogs;
    }
  };

  const EducationCard = ({ edu }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
      onClick={() => setExpandedCard(expandedCard === edu.id ? null : edu.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${edu.type === 'phd' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
            <FaGraduationCap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
            <p className="text-blue-300 font-medium">{edu.institution}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            edu.status === 'Ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {edu.status}
          </span>
          <div className="text-sm text-gray-400 mt-1">{edu.period}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
        <span className="flex items-center">
          <FaMapMarkerAlt className="mr-1" />
          {edu.location}
        </span>
        <span className="flex items-center">
          <FaBook className="mr-1" />
          {edu.field}
        </span>
        {edu.gpa && (
          <span className="flex items-center">
            <FaStar className="mr-1" />
            GPA: {edu.gpa}
          </span>
        )}
      </div>

      <p className="text-gray-300 mb-4">{edu.description}</p>

      <AnimatePresence>
        {expandedCard === edu.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/20">
              <h4 className="font-semibold text-blue-300 mb-2">Key Highlights:</h4>
              <ul className="space-y-2">
                {(edu.highlights || []).map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{highlight}</span>
                  </li>
                ))}
                {(!edu.highlights || edu.highlights.length === 0) && (
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">More details to be added</span>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-4">
        {expandedCard === edu.id ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
      </div>
    </motion.div>
  );

  const ProfessionalCard = ({ exp }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 cursor-pointer"
      onClick={() => setExpandedCard(expandedCard === exp.id ? null : exp.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${exp.type === 'research' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
            <FaBriefcase size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{exp.position}</h3>
            <p className="text-green-300 font-medium">{exp.company}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">{exp.period}</div>
          <span className="text-xs text-blue-300">{exp.location}</span>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{exp.description}</p>

      <AnimatePresence>
        {expandedCard === exp.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/20 space-y-4">
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Key Responsibilities:</h4>
                <ul className="space-y-2">
                  {(exp.responsibilities || []).map((resp, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{resp}</span>
                    </li>
                  ))}
                  {(!exp.responsibilities || exp.responsibilities.length === 0) && (
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">Responsibilities details to be added</span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {(exp.technologies || []).map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {(!exp.technologies || exp.technologies.length === 0) && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs border border-gray-500/30">
                      No technologies listed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-4">
        {expandedCard === exp.id ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
      </div>
    </motion.div>
  );

  const AchievementSection = ({ achievement }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6"
    >
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaTrophy className="mr-3 text-yellow-400" />
        {achievement.title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievement.items.map((item, index) => {
          const IconComponent = getAchievementIcon(item.type);
          const colorClass = getAchievementColor(item.type);
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-400/30 transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{item.name}</h4>
                  <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                  <span className="text-xs text-yellow-400 font-medium">{item.year}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  const SkillsSection = () => (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Skill Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setSelectedSkillCategory('technical')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedSkillCategory === 'technical'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
              : 'bg-white/10 text-gray-400 border border-white/20 hover:border-blue-400/30'
          }`}
        >
          Technical Skills
        </button>
        <button
          onClick={() => setSelectedSkillCategory('research')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedSkillCategory === 'research'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
              : 'bg-white/10 text-gray-400 border border-white/20 hover:border-purple-400/30'
          }`}
        >
          Research Areas
        </button>
        <button
          onClick={() => setSelectedSkillCategory('techstack')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedSkillCategory === 'techstack'
              ? 'bg-green-500/20 text-green-300 border border-green-400/50'
              : 'bg-white/10 text-gray-400 border border-white/20 hover:border-green-400/30'
          }`}
        >
          Tech Stack
        </button>
      </div>

      {/* Technical Skills */}
      {selectedSkillCategory === 'technical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedData.skills?.technical?.map((skillGroup, index) => {
            const IconComponent = getSkillIcon(skillGroup.category);
            
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <IconComponent size={20} />
                  </div>
                  <h4 className="font-semibold text-white">{skillGroup.category}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-sm border border-blue-500/30 hover:bg-blue-500/20 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          }) || (
            <div className="col-span-full text-center text-gray-400">
              No technical skills data available
            </div>
          )}
        </div>
      )}

      {/* Research Areas */}
      {selectedSkillCategory === 'research' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedData.skills?.research?.map((researchArea, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                  <FaFlask size={20} />
                </div>
                <h4 className="font-semibold text-white">{researchArea.area}</h4>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {researchArea.topics.map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm border border-purple-500/30 hover:bg-purple-500/20 transition-all"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          )) || (
            <div className="col-span-full text-center text-gray-400">
              No research areas data available
            </div>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {selectedSkillCategory === 'techstack' && mounted && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {techs_list.map((tech) => (
            <motion.div
              key={tech.id}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all text-center group"
            >
              <div className="flex justify-center mb-4">
                <img 
                  src={tech.src} 
                  alt={tech.title}
                  className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="font-semibold text-white mb-2">{tech.title}</h4>
              
              {/* Find corresponding skill level from our experiences data */}
              {(() => {
                const skillData = combinedData.skills.techStack?.find(
                  skillTech => skillTech.title === tech.title
                );
                // Use a deterministic seed based on tech.title to ensure consistent values between SSR and client
                const hashCode = tech.title.split('').reduce((a, b) => {
                  a = ((a << 5) - a) + b.charCodeAt(0);
                  return a & a;
                }, 0);
                const level = skillData?.level || Math.abs(hashCode % 40) + 60;
                const category = skillData?.category || "Technology";
                const description = skillData?.description || `Experience with ${tech.title}`;
                
                return (
                  <>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${level}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-green-400 mb-1">{level}% Proficiency</div>
                    <div className="text-xs text-gray-400 mb-2">{category}</div>
                    <p className="text-xs text-gray-300">{description}</p>
                  </>
                );
              })()}
            </motion.div>
          ))}
        </div>
      )}

      {/* Tech Stack Loading State */}
      {selectedSkillCategory === 'techstack' && !mounted && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-pulse">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-600 rounded"></div>
              </div>
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div className="bg-gray-600 h-2 rounded-full w-3/4"></div>
              </div>
              <div className="h-3 bg-gray-600 rounded mb-1"></div>
              <div className="h-3 bg-gray-600 rounded mb-2"></div>
              <div className="h-2 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
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
        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
            <p className="text-white mt-4">Loading experiences...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <div>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              My Journey
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore my educational background, professional experiences, achievements, and technical expertise
          </p>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">Education</h2>
          <div className="space-y-6">
            {combinedData.education.map((edu) => (
              <EducationCard key={edu.id} edu={edu} />
            ))}
          </div>
        </motion.div>

          {/* Professional Experience */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">Professional Experience</h2>
            <div className="space-y-6">
              {combinedData.professional.map((exp) => (
                <ProfessionalCard key={exp.id} exp={exp} />
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">Skills</h2>
            
            {/* Skill Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setSelectedSkillCategory('technical')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedSkillCategory === 'technical'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                    : 'bg-white/10 text-gray-400 border border-white/20 hover:border-blue-400/30'
                }`}
              >
                Technical Skills
              </button>
              <button
                onClick={() => setSelectedSkillCategory('research')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedSkillCategory === 'research'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                    : 'bg-white/10 text-gray-400 border border-white/20 hover:border-purple-400/30'
                }`}
              >
                Research Areas
              </button>
              <button
                onClick={() => setSelectedSkillCategory('techstack')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedSkillCategory === 'techstack'
                    ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                    : 'bg-white/10 text-gray-400 border border-white/20 hover:border-green-400/30'
                }`}
              >
                Tech Stack
              </button>
            </div>

            {/* Render the selected skill category */}
            <SkillsSection />
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">Achievements</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {combinedData.achievements?.map((achievement, index) => (
                <motion.div
                  key={achievement.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <FaTrophy className="text-3xl mr-3 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {achievement.items?.map((item, itemIndex) => {
                      const IconComponent = getAchievementIcon(item.type);
                      const colorClass = getAchievementColor(item.type);
                      
                      return (
                        <div key={itemIndex} className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <IconComponent size={16} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{item.name}</h4>
                              <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                              <span className="text-xs text-yellow-400 font-medium">{item.year}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )) || (
                <div className="col-span-full text-center text-gray-400">
                  <FaTrophy className="text-6xl mx-auto mb-4 opacity-50" />
                  <p>No achievements data available</p>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesPage;
