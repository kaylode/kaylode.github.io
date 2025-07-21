'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  FaGithub, 
  FaCode, 
  FaFire,
  FaStar,
  FaCodeBranch,
  FaCalendarAlt,
  FaChartLine,
  FaTrophy,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaGlobe
} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CalendarHeatmap = dynamic(() => import('react-calendar-heatmap'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-700 rounded animate-pulse"></div>
});
import { format, subDays, startOfYear, endOfYear, parseISO } from 'date-fns';
import '../styles/tracker.css';

const TrackerPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [githubStats, setGithubStats] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [commitData, setCommitData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [githubResponse, leetcodeResponse, commitsResponse] = await Promise.all([
          fetch('/api/github'),
          fetch('/api/leetcode'),
          fetch('/api/github/commits')
        ]);
        
        const githubData = await githubResponse.json();
        const leetcodeData = await leetcodeResponse.json();
        const commitsData = await commitsResponse.json();
        
        setGithubStats(githubData);
        setLeetcodeStats(leetcodeData);
        setCommitData(commitsData);
        setLastRefresh(new Date());
      } catch (error) {
        console.error('Error fetching tracker data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to refresh data from external APIs
  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      
      // Call the update-stats API to fetch fresh data from GitHub and LeetCode
      const updateResponse = await fetch('/api/update-stats', {
        method: 'POST'
      });
      
      if (updateResponse.ok) {
        // After updating, fetch the fresh data
        const [githubResponse, leetcodeResponse, commitsResponse] = await Promise.all([
          fetch('/api/github'),
          fetch('/api/leetcode'),
          fetch('/api/github/commits')
        ]);
        
        const githubData = await githubResponse.json();
        const leetcodeData = await leetcodeResponse.json();
        const commitsData = await commitsResponse.json();
        
        setGithubStats(githubData);
        setLeetcodeStats(leetcodeData);
        setCommitData(commitsData);
        setLastRefresh(new Date());
        
        console.log('Data refreshed successfully');
      } else {
        const errorData = await updateResponse.json();
        console.error('Failed to refresh data:', errorData.message);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Mock data for demonstration (replace with real data from APIs)
  const mockGithubCommits = commitData.length > 0 ? commitData : Array.from({ length: 365 }, (_, i) => {
    const date = format(subDays(new Date(), 365 - i), 'yyyy-MM-dd');
    return {
      date,
      count: Math.floor(Math.random() * 10),
    };
  });

  const mockLeetcodeProgress = [
    { month: 'Jan', easy: 0, medium: 0, hard: 0 },
    { month: 'Feb', easy: 0, medium: 0, hard: 0 },
    { month: 'Mar', easy: 0, medium: 0, hard: 0 },
    { month: 'Apr', easy: 0, medium: 0, hard: 0 },
    { month: 'May', easy: 0, medium: 0, hard: 0 },
    { month: 'Jun', easy: 0, medium: 0, hard: 0 },
  ];

  const mockLanguageStats = githubStats?.languages ? 
    Object.entries(githubStats.languages).map(([name, value]) => ({
      name,
      value,
      color: getLanguageColor(name)
    })) : [
      { name: 'Python', value: 35, color: '#3776ab' },
      { name: 'JavaScript', value: 25, color: '#f7df1e' },
      { name: 'TypeScript', value: 20, color: '#3178c6' },
      { name: 'Java', value: 10, color: '#ed8b00' },
      { name: 'C++', value: 10, color: '#00599c' },
    ];

  // Countries visited data
  const visitedCountries = [
    { name: 'Vietnam', flag: '🇻🇳', code: 'VN', year: 'Birth country', description: 'Home country' },
    { name: 'Singapore', flag: '🇸🇬', code: 'SG', year: '2022', description: 'Conference: MICCAI 2022' },
    { name: 'Ireland', flag: '🇮🇪', code: 'IE', year: '2022', description: 'Ph.D. studies at DCU' },
    { name: 'Netherlands', flag: '🇳🇱', code: 'NL', year: '2023', description: 'Tourism' },
    { name: 'Germany', flag: '🇩🇪', code: 'DE', year: '2023', description: 'Tourism' },
    { name: 'China', flag: '🇨🇳', code: 'CN', year: '2023', description: 'Visiting Huawei HQ' },
    { name: 'Portugal', flag: '🇵🇹', code: 'PT', year: '2024', description: 'Tourism' },
    { name: 'Belgium', flag: '🇧🇪', code: 'BE', year: '2024', description: 'Tourism' },
    { name: 'Italy', flag: '🇮🇹', code: 'IT', year: '2025', description: 'Tourism' },
    { name: 'Switzerland', flag: '🇨🇭', code: 'CH', year: '2025', description: 'Research visit: EPFL' },
    { name: 'France', flag: '🇫🇷', code: 'FR', year: '2025', description: 'Tourism' }
  ];

  // Helper function to get language colors
  function getLanguageColor(language) {
    const colors = {
      'Python': '#3776ab',
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Java': '#ed8b00',
      'C++': '#00599c',
      'React': '#61dafb',
      'Node.js': '#339933',
      'HTML': '#e34f26',
      'CSS': '#1572b6',
      'Go': '#00add8',
      'Rust': '#000000',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'Scala': '#dc322f',
      'Shell': '#89e051',
      'Dart': '#0175c2',
      'Vue': '#4fc08d',
      'Svelte': '#ff3e00'
    };
    return colors[language] || '#6b7280';
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'github', label: 'GitHub', icon: FaGithub },
    { id: 'leetcode', label: 'LeetCode', icon: SiLeetcode },
    { id: 'countries', label: 'Countries', icon: FaGlobe },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-600 bg-opacity-20`}>
          <Icon className={`text-2xl text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );

  const GitHubHeatmap = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FaGithub className="text-green-400" />
        GitHub Activity Heatmap
      </h3>
      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startOfYear(new Date())}
          endDate={endOfYear(new Date())}
          values={mockGithubCommits}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty';
            if (value.count < 3) return 'color-scale-1';
            if (value.count < 6) return 'color-scale-2';
            if (value.count < 9) return 'color-scale-3';
            return 'color-scale-4';
          }}
          tooltipDataAttrs={(value) => ({
            'data-tip': value.date ? `${value.count} contributions on ${value.date}` : 'No contributions',
          })}
        />
      </div>
      <style jsx>{`
        .color-empty { fill: #161b22; }
        .color-scale-1 { fill: #0e4429; }
        .color-scale-2 { fill: #006d32; }
        .color-scale-3 { fill: #26a641; }
        .color-scale-4 { fill: #39d353; }
      `}</style>
    </div>
  );

  const LeetCodeChart = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <SiLeetcode className="text-yellow-400" />
        LeetCode Progress
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockLeetcodeProgress}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Area type="monotone" dataKey="easy" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
          <Area type="monotone" dataKey="medium" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
          <Area type="monotone" dataKey="hard" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const LanguageChart = () => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FaCode className="text-purple-400" />
        Programming Languages
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockLanguageStats}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {mockLanguageStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const CountriesTab = () => (
    <div className="space-y-8">
      {/* Countries Header */}
      <div className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Countries I've Visited
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          My journey across {visitedCountries.length} countries for research, conferences, and exploration
        </motion.p>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visitedCountries.map((country, index) => (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {country.flag}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{country.name}</h3>
              <div className="space-y-2">
                <div className="text-sm text-blue-400 font-semibold">
                  {country.year}
                </div>
                <div className="text-sm text-gray-400">
                  {country.description}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Countries Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
        >
          <FaGlobe className="text-4xl text-blue-400 mx-auto mb-4" />
          <div className="text-3xl font-bold text-white mb-2">{visitedCountries.length}</div>
          <div className="text-gray-400">Countries Visited</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
        >
          <FaTrophy className="text-4xl text-yellow-400 mx-auto mb-4" />
          <div className="text-3xl font-bold text-white mb-2">3</div>
          <div className="text-gray-400">Continents Explored</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
        >
          <FaCalendarAlt className="text-4xl text-green-400 mx-auto mb-4" />
          <div className="text-3xl font-bold text-white mb-2">6</div>
          <div className="text-gray-400">Years Traveling</div>
        </motion.div>
      </div>

      {/* Travel Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FaCalendarAlt className="text-green-400" />
          Travel Timeline
        </h3>
        <div className="space-y-4">
          {visitedCountries
            .sort((a, b) => {
              if (a.year === 'Birth country') return -1;
              if (b.year === 'Birth country') return 1;
              return parseInt(a.year) - parseInt(b.year);
            })
            .map((country, index) => (
              <div key={country.code} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="text-2xl">{country.flag}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{country.name}</span>
                    <span className="text-blue-400 text-sm">{country.year}</span>
                  </div>
                  <div className="text-gray-400 text-sm">{country.description}</div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="GitHub Repositories"
          value={githubStats?.publicRepos || 50}
          icon={FaGithub}
          trend={5}
          color="green"
        />
        <StatCard
          title="Total Stars"
          value={githubStats?.totalStars || 127}
          icon={FaStar}
          trend={12}
          color="yellow"
        />
        <StatCard
          title="LeetCode Solved"
          value={leetcodeStats?.totalSolved || 245}
          icon={SiLeetcode}
          trend={8}
          color="orange"
        />
        <StatCard
          title="Contributions"
          value="1,234"
          icon={FaFire}
          trend={15}
          color="red"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GitHubHeatmap />
        <LeetCodeChart />
      </div>
    </div>
  );

  const GitHubTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Public Repos"
          value={githubStats?.publicRepos || 50}
          icon={FaGithub}
          color="green"
        />
        <StatCard
          title="Followers"
          value={githubStats?.followers || 123}
          icon={FaCodeBranch}
          color="blue"
        />
        <StatCard
          title="Following"
          value={githubStats?.following || 45}
          icon={FaCodeBranch}
          color="purple"
        />
      </div>

      <GitHubHeatmap />

      {/* Top Repositories */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Top Repositories</h3>
        <div className="space-y-4">
          {(githubStats?.topRepositories || []).slice(0, 5).map((repo, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <h4 className="text-white font-medium">{repo.name}</h4>
                <p className="text-gray-400 text-sm">{repo.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <FaCodeBranch />
                  {repo.forks}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LeetCodeTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Easy Solved"
          value={leetcodeStats?.easySolved || 89}
          icon={FaTrophy}
          color="green"
        />
        <StatCard
          title="Medium Solved"
          value={leetcodeStats?.mediumSolved || 126}
          icon={FaTrophy}
          color="yellow"
        />
        <StatCard
          title="Hard Solved"
          value={leetcodeStats?.hardSolved || 30}
          icon={FaTrophy}
          color="red"
        />
        <StatCard
          title="Total Solved"
          value={leetcodeStats?.totalSolved || 245}
          icon={SiLeetcode}
          color="orange"
        />
      </div>

      <LeetCodeChart />

      {/* LeetCode Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Difficulty Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: 'Easy', count: leetcodeStats?.easySolved || 89, color: '#10B981' },
              { name: 'Medium', count: leetcodeStats?.mediumSolved || 126, color: '#F59E0B' },
              { name: 'Hard', count: leetcodeStats?.hardSolved || 30, color: '#EF4444' },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Ranking</span>
              <span className="text-blue-400 font-medium">#{leetcodeStats?.ranking || 12345}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Acceptance Rate</span>
              <span className="text-green-400 font-medium">{leetcodeStats?.acceptanceRate || 75.2}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Contest Rating</span>
              <span className="text-purple-400 font-medium">{leetcodeStats?.contestRating || 1650}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
            <p className="text-white mt-4">Loading tracker data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
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
              Tracker
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Real-time statistics and progress tracking across platforms
          </p>
          
          {/* Refresh Data Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isRefreshing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
              }`}
            >
              {isRefreshing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <FaArrowUp className="text-sm" />
                  Refresh Data
                </>
              )}
            </button>
            
            {lastRefresh && (
              <div className="text-sm text-gray-400">
                Last updated: {lastRefresh.toLocaleString()}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-1 border border-gray-700 flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-md transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'github' && <GitHubTab />}
          {activeTab === 'leetcode' && <LeetCodeTab />}
          {activeTab === 'countries' && <CountriesTab />}
        </motion.div>
      </div>
    </section>
  );
};

export default TrackerPage;
