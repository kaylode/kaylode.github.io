'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FaArrowDown
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
import CalendarHeatmap from 'react-calendar-heatmap';
import { format, subDays, startOfYear, endOfYear, parseISO } from 'date-fns';
import '../styles/tracker.css';

const TrackerPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('yearly');
  const [githubStats, setGithubStats] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [commitData, setCommitData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Manual update function
  const updateData = async () => {
    try {
      setIsUpdating(true);
      
      // Trigger data update
      const updateResponse = await fetch('/api/update-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        console.log('Update result:', updateResult);
        
        // Refresh data after update
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
      }
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setIsUpdating(false);
    }
  };

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
      } catch (error) {
        console.error('Error fetching tracker data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data for demonstration (replace with real data from APIs)
  const mockGithubCommits = commitData.length > 0 ? commitData : Array.from({ length: 365 }, (_, i) => {
    const date = format(subDays(new Date(), 365 - i), 'yyyy-MM-dd');
    return {
      date,
      count: Math.floor(Math.random() * 10),
    };
  });

  const mockLeetcodeProgress = [
    { month: 'Jan', easy: 15, medium: 8, hard: 2 },
    { month: 'Feb', easy: 22, medium: 12, hard: 4 },
    { month: 'Mar', easy: 18, medium: 15, hard: 6 },
    { month: 'Apr', easy: 25, medium: 18, hard: 8 },
    { month: 'May', easy: 30, medium: 22, hard: 10 },
    { month: 'Jun', easy: 28, medium: 25, hard: 12 },
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
    { id: 'languages', label: 'Languages', icon: FaCode },
  ];

  const timeRanges = [
    { id: 'daily', label: 'Daily' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
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
          
          {/* Update Data Button */}
          <motion.button
            onClick={updateData}
            disabled={isUpdating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isUpdating 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            } shadow-lg`}
          >
            {isUpdating ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <FaArrowUp className="rotate-45" />
                <span>Update Data</span>
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-1 border border-gray-700">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  timeRange === range.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-1 border border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-300 ${
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
          {activeTab === 'languages' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LanguageChart />
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Language Stats</h3>
                <div className="space-y-4">
                  {mockLanguageStats.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-white">{lang.name}</span>
                      </div>
                      <span className="text-gray-400">{lang.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TrackerPage;
