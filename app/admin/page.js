'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSync, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DataSyncManager from '../../src/components/admin/DataSyncManager';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('projects');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [initialLoad, setInitialLoad] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && !initialLoad) {
      fetchData(activeTab);
      setInitialLoad(true);
    }
  }, [status, activeTab, initialLoad]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const tabs = [
    { id: 'projects', label: 'Projects', endpoint: '/api/projects' },
    { id: 'publications', label: 'Publications', endpoint: '/api/publications' },
    { id: 'education', label: 'Education', endpoint: '/api/education' },
    { id: 'experiences', label: 'Experience', endpoint: '/api/experiences' },
    { id: 'technologies', label: 'Technologies', endpoint: '/api/technologies' },
    { id: 'achievements', label: 'Achievements', endpoint: '/api/achievements' },
    { id: 'blog', label: 'Blog Posts', endpoint: '/api/blog' },
  ];

  const fetchData = async (tabId) => {
    setLoading(true);
    try {
      const tab = tabs.find(t => t.id === tabId);
      const response = await fetch(tab.endpoint);
      const result = await response.json();
      setData(prev => ({ ...prev, [tabId]: result }));
    } catch (error) {
      console.error(`Error fetching ${tabId}:`, error);
    }
    setLoading(false);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (!data[tabId]) {
      fetchData(tabId);
    }
  };

  const handleSave = async (item, endpoint) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        fetchData(activeTab);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id, endpoint) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      fetchData(activeTab);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const refreshAllData = async () => {
    setRefreshing(true);
    try {
      // Clear existing data and refetch all tabs
      setData({});
      for (const tab of tabs) {
        await fetchData(tab.id);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  const renderProjectForm = (item = {}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">
        {item.id ? 'Edit Project' : 'Add New Project'}
      </h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectData = {
          id: item.id,
          title: formData.get('title'),
          description: formData.get('description'),
          technologies: formData.get('technologies').split(',').map(t => t.trim()),
          githubUrl: formData.get('githubUrl'),
          liveUrl: formData.get('liveUrl'),
          image: formData.get('image'),
          featured: formData.get('featured') === 'on',
          stars: parseInt(formData.get('stars')) || 0,
          forks: parseInt(formData.get('forks')) || 0,
          language: formData.get('language'),
        };
        handleSave(projectData, '/api/projects');
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Title" defaultValue={item.title} required
                 className="p-2 border rounded" />
          <input name="language" placeholder="Language" defaultValue={item.language}
                 className="p-2 border rounded" />
          <input name="githubUrl" placeholder="GitHub URL" defaultValue={item.githubUrl}
                 className="p-2 border rounded" />
          <input name="liveUrl" placeholder="Live URL" defaultValue={item.liveUrl}
                 className="p-2 border rounded" />
          <input name="image" placeholder="Image URL" defaultValue={item.image}
                 className="p-2 border rounded" />
          <input name="technologies" placeholder="Technologies (comma separated)" 
                 defaultValue={item.technologies?.join(', ')} className="p-2 border rounded" />
          <input name="stars" type="number" placeholder="Stars" defaultValue={item.stars}
                 className="p-2 border rounded" />
          <input name="forks" type="number" placeholder="Forks" defaultValue={item.forks}
                 className="p-2 border rounded" />
        </div>
        <textarea name="description" placeholder="Description" defaultValue={item.description}
                  required className="w-full p-2 border rounded mt-4" rows="3" />
        <label className="flex items-center mt-4">
          <input name="featured" type="checkbox" defaultChecked={item.featured}
                 className="mr-2" />
          Featured Project
        </label>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {item.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderTechnologyForm = (item = {}) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">
        {item.id ? 'Edit Technology' : 'Add New Technology'}
      </h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const techData = {
          id: item.id,
          name: formData.get('name'),
          category: formData.get('category'),
          icon: formData.get('icon'),
          description: formData.get('description'),
          proficiency: formData.get('proficiency'),
          yearStarted: parseInt(formData.get('yearStarted')) || null,
          isVisible: formData.get('isVisible') === 'on',
          color: formData.get('color'),
        };
        handleSave(techData, '/api/technologies');
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" defaultValue={item.name} required
                 className="p-2 border rounded" />
          <select name="category" defaultValue={item.category} className="p-2 border rounded">
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="database">Database</option>
            <option value="tools">Tools</option>
            <option value="languages">Languages</option>
          </select>
          <input name="icon" placeholder="Icon URL" defaultValue={item.icon}
                 className="p-2 border rounded" />
          <select name="proficiency" defaultValue={item.proficiency} className="p-2 border rounded">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
          <input name="yearStarted" type="number" placeholder="Year Started" 
                 defaultValue={item.yearStarted} className="p-2 border rounded" />
          <input name="color" placeholder="Color (hex)" defaultValue={item.color}
                 className="p-2 border rounded" />
        </div>
        <textarea name="description" placeholder="Description" defaultValue={item.description}
                  className="w-full p-2 border rounded mt-4" rows="2" />
        <label className="flex items-center mt-4">
          <input name="isVisible" type="checkbox" defaultChecked={item.isVisible}
                 className="mr-2" />
          Visible on website
        </label>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {item.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderPublicationForm = (item = {}) => (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">{item?.id ? 'Edit Publication' : 'Add New Publication'}</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Convert authors from textarea to array
        if (data.authors) {
          data.authors = data.authors.split(',').map(a => a.trim()).filter(a => a !== '');
        } else {
          data.authors = [];
        }
        
        // Ensure citations is a number
        if (data.citations) {
          data.citations = parseInt(data.citations, 10);
        }
        
        handleSave(data, '/api/publications');
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Title" defaultValue={item?.title || ''} required
                 className="p-2 border rounded" />
          <input name="venue" placeholder="Venue" defaultValue={item?.venue || ''} required
                 className="p-2 border rounded" />
          <input name="year" type="number" placeholder="Year" defaultValue={item?.year || ''} required
                 className="p-2 border rounded" />
          <select name="category" defaultValue={item?.category || 'conference'} required
                  className="p-2 border rounded">
            <option value="">Select Category</option>
            <option value="conference">Conference</option>
            <option value="journal">Journal</option>
            <option value="workshop">Workshop</option>
            <option value="preprint">Preprint</option>
            <option value="book">Book</option>
            <option value="thesis">Thesis</option>
          </select>
          <input name="doi" placeholder="DOI" defaultValue={item?.doi || ''}
                 className="p-2 border rounded" />
          <input name="arxivId" placeholder="ArXiv ID" defaultValue={item?.arxivId || ''}
                 className="p-2 border rounded" />
          <input name="pdfUrl" placeholder="PDF URL" defaultValue={item?.pdfUrl || ''}
                 className="p-2 border rounded" />
          <input name="citations" type="number" placeholder="Citations" defaultValue={item?.citations || 0}
                 className="p-2 border rounded" />
        </div>
        <textarea name="authors" placeholder="Authors (comma-separated)" 
                  defaultValue={Array.isArray(item?.authors) ? item.authors.join(', ') : ''}
                  className="w-full p-2 border rounded mt-4" rows="2" required />
        <textarea name="abstract" placeholder="Abstract" defaultValue={item?.abstract || ''}
                  className="w-full p-2 border rounded mt-4" rows="4" />
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {item?.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderEducationForm = (item = {}) => (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">{item.id ? 'Edit Education' : 'Add New Education'}</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Convert boolean fields
        data.isVisible = data.isVisible === 'on';
        
        // Convert highlights from textarea to array
        if (data.highlights) {
          data.highlights = data.highlights.split('\n').filter(h => h.trim() !== '');
        } else {
          data.highlights = [];
        }
        
        // Ensure order is a number
        if (data.order) {
          data.order = parseInt(data.order, 10);
        }
        
        handleSave(data, '/api/education');
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="institution" placeholder="Institution" defaultValue={item?.institution || ''} required
                 className="p-2 border rounded" />
          <input name="location" placeholder="Location" defaultValue={item?.location || ''} required
                 className="p-2 border rounded" />
          <input name="degree" placeholder="Degree" defaultValue={item?.degree || ''} required
                 className="p-2 border rounded" />
          <input name="field" placeholder="Field of Study" defaultValue={item?.field || ''} required
                 className="p-2 border rounded" />
          <select name="status" defaultValue={item?.status || 'Completed'} required
                  className="p-2 border rounded">
            <option value="">Select Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Dropped">Dropped</option>
          </select>
          <select name="type" defaultValue={item?.type || 'bachelor'} required
                  className="p-2 border rounded">
            <option value="">Select Type</option>
            <option value="bachelor">Bachelor's</option>
            <option value="master">Master's</option>
            <option value="phd">PhD</option>
            <option value="certificate">Certificate</option>
            <option value="diploma">Diploma</option>
            <option value="associate">Associate</option>
          </select>
          <input name="startDate" type="date" placeholder="Start Date" 
                 defaultValue={item?.startDate ? new Date(item.startDate).toISOString().split('T')[0] : ''}
                 className="p-2 border rounded" />
          <input name="endDate" type="date" placeholder="End Date" 
                 defaultValue={item?.endDate ? new Date(item.endDate).toISOString().split('T')[0] : ''}
                 className="p-2 border rounded" />
          <input name="gpa" placeholder="GPA" defaultValue={item?.gpa || ''}
                 className="p-2 border rounded" />
          <input name="order" type="number" placeholder="Order" defaultValue={item?.order || 0}
                 className="p-2 border rounded" />
        </div>
        <textarea name="description" placeholder="Description" defaultValue={item?.description || ''}
                  className="w-full p-2 border rounded mt-4" rows="3" />
        <textarea name="highlights" placeholder="Highlights (one per line)" 
                  defaultValue={Array.isArray(item?.highlights) ? item.highlights.join('\n') : ''}
                  className="w-full p-2 border rounded mt-4" rows="3" />
        <input name="logo" placeholder="Logo URL" defaultValue={item?.logo || ''}
               className="w-full p-2 border rounded mt-4" />
        <div className="flex items-center gap-2 mt-4">
          <input name="isVisible" type="checkbox" defaultChecked={item?.isVisible !== false}
                 className="w-4 h-4" />
          <label>Visible on site</label>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {item.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderExperienceForm = (item = {}) => (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">{item.id ? 'Edit Experience' : 'Add New Experience'}</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Convert boolean fields
        data.isCurrent = data.current === 'on';
        data.isVisible = data.isVisible === 'on';
        
        // Convert responsibilities from textarea to array
        if (data.responsibilities) {
          data.responsibilities = data.responsibilities.split('\n').filter(r => r.trim() !== '');
        } else {
          data.responsibilities = [];
        }
        
        // Convert technologies from textarea to array
        if (data.technologies) {
          data.technologies = data.technologies.split('\n').filter(t => t.trim() !== '');
        } else {
          data.technologies = [];
        }
        
        // Ensure order is a number
        if (data.order) {
          data.order = parseInt(data.order, 10);
        }
        
        handleSave(data, '/api/experiences');
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="company" placeholder="Company" defaultValue={item?.company || ''} required
                 className="p-2 border rounded" />
          <input name="position" placeholder="Position" defaultValue={item?.position || ''} required
                 className="p-2 border rounded" />
          <input name="location" placeholder="Location" defaultValue={item?.location || ''}
                 className="p-2 border rounded" />
          <input name="startDate" type="date" placeholder="Start Date" 
                 defaultValue={item?.startDate ? new Date(item.startDate).toISOString().split('T')[0] : ''} 
                 required className="p-2 border rounded" />
          <input name="endDate" type="date" placeholder="End Date" 
                 defaultValue={item?.endDate ? new Date(item.endDate).toISOString().split('T')[0] : ''}
                 className="p-2 border rounded" />
          <input name="url" placeholder="Company URL" defaultValue={item?.website || item?.url || ''}
                 className="p-2 border rounded" />
          <input name="order" type="number" placeholder="Order" defaultValue={item?.order || 0}
                 className="p-2 border rounded" />
          <input name="logo" placeholder="Company Logo URL" defaultValue={item?.logo || ''}
                 className="p-2 border rounded" />
        </div>
        <textarea name="description" placeholder="Description" defaultValue={item?.description || ''}
                  className="w-full p-2 border rounded mt-4" rows="4" />
        <textarea name="responsibilities" placeholder="Key Responsibilities (one per line)" 
                  defaultValue={Array.isArray(item?.responsibilities) ? item.responsibilities.join('\n') : ''}
                  className="w-full p-2 border rounded mt-4" rows="5" />
        <textarea name="technologies" placeholder="Technologies Used (one per line)" 
                  defaultValue={Array.isArray(item?.technologies) ? item.technologies.join('\n') : ''}
                  className="w-full p-2 border rounded mt-4" rows="4" />
        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center">
            <input type="checkbox" name="current" defaultChecked={item?.isCurrent || false}
                   className="mr-2" />
            Current Position
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="isVisible" defaultChecked={item?.isVisible !== false}
                   className="mr-2" />
            Visible on site
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {item.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderBlogForm = (item) => (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">{item.id ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Convert boolean fields
        data.published = data.published === 'on';
        data.featured = data.featured === 'on';
        
        // Convert tags
        if (data.tags) {
          data.tags = data.tags.split(',').map(tag => tag.trim());
        }
        
        handleSave(data, '/api/blog');
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Title" defaultValue={item.title} required
                 className="p-2 border rounded" />
          <input name="slug" placeholder="URL Slug" defaultValue={item.slug} required
                 className="p-2 border rounded" />
          <input name="publishedAt" type="date" placeholder="Published Date" defaultValue={item.publishedAt}
                 className="p-2 border rounded" />
          <input name="readingTime" type="number" placeholder="Reading Time (minutes)" defaultValue={item.readingTime}
                 className="p-2 border rounded" />
        </div>
        <textarea name="summary" placeholder="Summary" defaultValue={item.summary}
                  className="w-full p-2 border rounded mt-4" rows="3" />
        <textarea name="content" placeholder="Content (Markdown)" defaultValue={item.content}
                  className="w-full p-2 border rounded mt-4" rows="10" />
        <input name="tags" placeholder="Tags (comma-separated)" defaultValue={item.tags?.join(', ')}
               className="w-full p-2 border rounded mt-4" />
        <div className="flex gap-4 mt-4">
          <label className="flex items-center">
            <input type="checkbox" name="published" defaultChecked={item.published}
                   className="mr-2" />
            Published
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="featured" defaultChecked={item.featured}
                   className="mr-2" />
            Featured
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {item.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderAchievementForm = (item = {}) => (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">{item.id ? 'Edit Achievement' : 'Add New Achievement'}</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Convert boolean fields
        data.isVisible = data.isVisible === 'on';
        data.order = parseInt(data.order) || 0;
        
        handleSave(data, '/api/achievements');
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Achievement Title" defaultValue={item.title} required
                 className="p-2 border rounded" />
          <input name="category" placeholder="Category" defaultValue={item.category} required
                 className="p-2 border rounded" />
          <select name="type" defaultValue={item.type} required className="p-2 border rounded">
            <option value="">Select Type</option>
            <option value="academic">Academic</option>
            <option value="competition">Competition</option>
            <option value="hackathon">Hackathon</option>
            <option value="scholarship">Scholarship</option>
            <option value="recognition">Recognition</option>
          </select>
          <input name="year" placeholder="Year (e.g., 2020, 2020-2021)" defaultValue={item.year} required
                 className="p-2 border rounded" />
          <input name="organization" placeholder="Organization (optional)" defaultValue={item.organization}
                 className="p-2 border rounded" />
          <input name="rank" placeholder="Rank/Position (e.g., 1st Place, Runner-up)" defaultValue={item.rank}
                 className="p-2 border rounded" />
          <input name="value" placeholder="Value (e.g., GPA, Amount)" defaultValue={item.value}
                 className="p-2 border rounded" />
          <input name="url" placeholder="URL (optional)" defaultValue={item.url}
                 className="p-2 border rounded" />
          <input name="image" placeholder="Image URL (optional)" defaultValue={item.image}
                 className="p-2 border rounded" />
          <input name="order" type="number" placeholder="Display Order" defaultValue={item.order || 0}
                 className="p-2 border rounded" />
        </div>
        <div className="mt-4">
          <textarea name="description" placeholder="Description" defaultValue={item.description} required
                    rows="3" className="w-full p-2 border rounded" />
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input type="checkbox" name="isVisible" defaultChecked={item.isVisible !== false} />
            <span className="ml-2">Visible</span>
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {item.id ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={() => setEditingItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderDataTable = (items, type) => {
    if (!items || items.length === 0) {
      return <div className="text-center py-8 text-gray-500">No data available</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {type === 'projects' && (
                <>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Language</th>
                  <th className="px-4 py-2 text-left">Stars</th>
                  <th className="px-4 py-2 text-left">Featured</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </>
              )}
              {type === 'technologies' && (
                <>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Proficiency</th>
                  <th className="px-4 py-2 text-left">Visible</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </>
              )}
              {type === 'publications' && (
                <>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Venue</th>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </>
              )}
              {type === 'education' && (
                <>
                  <th className="px-4 py-2 text-left">Institution</th>
                  <th className="px-4 py-2 text-left">Degree</th>
                  <th className="px-4 py-2 text-left">Field</th>
                  <th className="px-4 py-2 text-left">Years</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </>
              )}
              {type === 'experiences' && (
                <>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Position</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                  <th className="px-4 py-2 text-left">Current</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </>
              )}
              {type === 'achievements' && (
                <>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Year</th>
                  <th className="px-4 py-2 text-left">Organization</th>
                  <th className="px-4 py-2 text-left">Visible</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </>
              )}
              {type === 'blog' && (
                <>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Published</th>
                  <th className="px-4 py-2 text-left">Featured</th>
                  <th className="px-4 py-2 text-left">Reading Time</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                {type === 'projects' && (
                  <>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.language}</td>
                    <td className="px-4 py-2">{item.stars}</td>
                    <td className="px-4 py-2">
                      {item.featured ? <FaEye className="text-green-500" /> : <FaEyeSlash className="text-gray-400" />}
                    </td>
                  </>
                )}
                {type === 'technologies' && (
                  <>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">{item.proficiency}</td>
                    <td className="px-4 py-2">
                      {item.isVisible ? <FaEye className="text-green-500" /> : <FaEyeSlash className="text-gray-400" />}
                    </td>
                  </>
                )}
                {type === 'publications' && (
                  <>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.venue}</td>
                    <td className="px-4 py-2">{item.year}</td>
                  </>
                )}
                {type === 'education' && (
                  <>
                    <td className="px-4 py-2">{item.institution}</td>
                    <td className="px-4 py-2">{item.degree}</td>
                    <td className="px-4 py-2">{item.field}</td>
                    <td className="px-4 py-2">{item.startYear} - {item.endYear || 'Present'}</td>
                  </>
                )}
                {type === 'experiences' && (
                  <>
                    <td className="px-4 py-2">{item.company}</td>
                    <td className="px-4 py-2">{item.position}</td>
                    <td className="px-4 py-2">{item.startDate} - {item.endDate || 'Present'}</td>
                    <td className="px-4 py-2">
                      {item.current ? <FaEye className="text-green-500" /> : <FaEyeSlash className="text-gray-400" />}
                    </td>
                  </>
                )}
                {type === 'achievements' && (
                  <>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.type === 'competition' ? 'bg-yellow-100 text-yellow-800' :
                        item.type === 'academic' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'hackathon' ? 'bg-green-100 text-green-800' :
                        item.type === 'scholarship' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{item.year}</td>
                    <td className="px-4 py-2">{item.organization || '-'}</td>
                    <td className="px-4 py-2">
                      {item.isVisible ? <FaEye className="text-green-500" /> : <FaEyeSlash className="text-gray-400" />}
                    </td>
                  </>
                )}
                {type === 'blog' && (
                  <>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">
                      {item.published ? <FaEye className="text-green-500" /> : <FaEyeSlash className="text-gray-400" />}
                    </td>
                    <td className="px-4 py-2">
                      {item.featured ? <FaEye className="text-green-500" /> : <FaEyeSlash className="text-gray-400" />}
                    </td>
                    <td className="px-4 py-2">{item.readingTime} min</td>
                  </>
                )}
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(item)}
                            className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id, tabs.find(t => t.id === activeTab).endpoint)}
                            className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your portfolio content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  {session?.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <FaUser className="text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Database Sync Manager */}
        <DataSyncManager />

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
          </div>
          <button
            onClick={refreshAllData}
            disabled={refreshing}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 mx-1 rounded-t-lg ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white border-b-2 border-blue-500' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Add New Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
            <button
              onClick={() => setEditingItem({})}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              <FaPlus /> Add New
            </button>
          </div>

          {/* Form Modal */}
          {editingItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {activeTab === 'projects' && renderProjectForm(editingItem)}
                {activeTab === 'technologies' && renderTechnologyForm(editingItem)}
                {activeTab === 'publications' && renderPublicationForm(editingItem)}
                {activeTab === 'education' && renderEducationForm(editingItem)}
                {activeTab === 'experiences' && renderExperienceForm(editingItem)}
                {activeTab === 'achievements' && renderAchievementForm(editingItem)}
                {activeTab === 'blog' && renderBlogForm(editingItem)}
              </div>
            </div>
          )}

          {/* Data Display */}
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              {activeTab === 'publications' && data[activeTab] && (
                // Publications are grouped by year
                Object.entries(data[activeTab]).map(([year, publications]) => (
                  <div key={year} className="mb-8">
                    <h3 className="text-xl font-bold mb-4">{year}</h3>
                    {renderDataTable(publications, activeTab)}
                  </div>
                ))
              )}
              {activeTab !== 'publications' && data[activeTab] && (
                renderDataTable(data[activeTab], activeTab)
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
