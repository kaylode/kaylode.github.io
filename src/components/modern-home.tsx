import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FaGithub, 
  FaLinkedin, 
  FaDiscord, 
  FaFacebook, 
  FaDownload, 
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCode,
  FaGamepad,
  FaBook,
  FaInstagram,
  FaTwitter
} from 'react-icons/fa';
import { SiGooglescholar, SiOrcid } from 'react-icons/si';
import avatar from '../assets/avatar.png';

const ModernHome: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "AI Researcher",
    "Ph.D. Student", 
    "AI Engineer",
    "Software Developer",
    "Open Source Contributor"
  ];

  const stats = [
    { label: "Years of Experience", value: "5+", icon: FaCode },
    { label: "Research Papers", value: "10+", icon: FaGraduationCap },
    { label: "GitHub Repositories", value: "50+", icon: FaGithub }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/kaylode",
      icon: FaGithub,
      color: "hover:text-gray-300"
    },
    {
      name: "LinkedIn", 
      url: "https://linkedin.com/in/kaylode/",
      icon: FaLinkedin,
      color: "hover:text-blue-400"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/Kaylode",
      icon: FaFacebook,
      color: "hover:text-blue-500"
    },
    {
      name: "Discord",
      url: "https://discordapp.com/users/326944513396441089",
      icon: FaDiscord,
      color: "hover:text-indigo-400"
    },
    {
      name: "Google Scholar",
      url: "https://scholar.google.com/citations?user=XLaKjh4AAAAJ&hl=en&oi=ao",
      icon: SiGooglescholar,
      color: "hover:text-blue-600"
    },
    {
      name: "ORCID",
      url: "https://orcid.org/0000-0003-3211-9076",
      icon: SiOrcid,
      color: "hover:text-green-500"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/_kaylochee",
      icon: FaInstagram,
      color: "hover:text-pink-400"
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/_kaylode",
      icon: FaTwitter,
      color: "hover:text-sky-400"
    }
  ];

  const interests = [
    { name: "Gaming", icon: FaGamepad, color: "text-purple-400" },
    { name: "Marvel Comics", icon: FaBook, color: "text-red-400" },
    { name: "Research", icon: FaGraduationCap, color: "text-blue-400" },
    { name: "Open Source", icon: FaCode, color: "text-green-400" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Rotate through roles
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  const avatarVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1
      }
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-center min-h-screen"
        >
          {/* Left Column - Text Content */}
          <div className="text-white space-y-8">
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl lg:text-7xl font-bold mb-4">
                Hi there 
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block ml-4"
                >
                  👋
                </motion.span>
              </h1>
              
              <div className="text-xl lg:text-2xl text-gray-300 mb-4">
                I'm <span className="text-blue-400 font-semibold">Minh-Khoi Pham</span> (Kay)
              </div>
              
              <div className="text-2xl lg:text-3xl h-12 mb-6">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentRole}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold"
                  >
                    {roles[currentRole]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 text-lg text-gray-300">
              <p className="flex items-center">
                <FaMapMarkerAlt className="text-red-400 mr-2" />
                Dublin, Ireland 🇮🇪 (Originally from Vietnam 🇻🇳)
              </p>
              <p className="flex items-center">
                <FaGraduationCap className="text-blue-400 mr-2" />
                Ph.D. Student at Dublin City University
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.a
                href="https://drive.google.com/file/d/1QuBwk92yxYacEvgHm6d2KKRFAgVm873L/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaDownload />
                Download Resume
              </motion.a>
              
              <motion.a
                href="mailto:kayp.kieran@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <FaEnvelope />
                Get In Touch
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-400 ${social.color} text-2xl transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <social.icon />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Avatar & Stats */}
          <div className="text-center lg:text-right">
            <motion.div variants={avatarVariants} className="relative inline-block mb-8">
              <div className="relative">
                <motion.img
                  src={avatar}
                  alt="Minh-Khoi Pham (Kay)"
                  className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-blue-400 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full"></div>
                
                {/* Floating elements around avatar */}
                {interests.map((interest, index) => (
                  <motion.div
                    key={interest.name}
                    className={`absolute ${interest.color} text-2xl`}
                    style={{
                      top: `${20 + Math.sin(index * Math.PI / 2) * 30}%`,
                      left: `${20 + Math.cos(index * Math.PI / 2) * 30}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2 + index * 0.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <interest.icon />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300"
                >
                  <stat.icon className="text-2xl text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Buy Me Coffee Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 text-white"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-6 modern-font">
              <span className="gradient-text">
                Support My Work
              </span>
            </h3>
            <motion.div 
              className="inline-block bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-300 text-center max-w-md modern-font">
                  If you find my work helpful or inspiring, consider buying me a coffee! ☕
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/bmc_qr.png"
                    alt="Buy Me Coffee QR Code"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-lg border-2 border-blue-400/30"
                  />
                </motion.div>
                <p className="text-sm text-gray-400 modern-font">
                  Scan with your phone to support my research and projects
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* About Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-24 text-white"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                About Me
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto"></div>
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-4xl mx-auto space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              I'm an AI researcher and engineer from Vietnam 🇻🇳 - a country known for its long-standing 
              culture and customs. Currently pursuing my Ph.D. at Dublin City University, Dublin, Ireland, working at the ADAPT research center. My research focuses on using advanced machine learning and deep learning models to study patients' electronic health records in healthcare.
            </p>
            
            <p>
              I graduated with a Bachelor's degree in Computer Science from the Honors Program at{' '}
              <a href="https://www.hcmus.edu.vn/" className="text-blue-400 hover:text-blue-300 transition-colors">
                University of Science
              </a>, VNU-HCM, Vietnam. 
            </p>
            
            <p>
              I'm passionate about discovering new methods, state-of-the-art models, and applying or 
              reimplementing them. Technology evolves daily, so I dedicate effort to exploring as many 
              new innovations as possible. All my code is open source on my GitHub for educational 
              purposes and for fellow researchers and developers to reference.
            </p>
            
            <p>
              During my college years, I enhanced my experience by studying and working on diverse 
              projects using various technologies including Android development, Web Servers, and 
              Game development.
            </p>
            
            <p>
              When I'm not programming, I enjoy playing games 🎮 and reading Marvel comics 📕.
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default ModernHome;
