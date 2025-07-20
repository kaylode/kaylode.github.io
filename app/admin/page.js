'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const tabs = [
    { id: 'projects', label: 'Projects', endpoint: '/api/projects' },
    { id: 'publications', label: 'Publications', endpoint: '/api/publications' },
    { id: 'education', label: 'Education', endpoint: '/api/education' },
    { id: 'experiences', label: 'Experience', endpoint: '/api/experiences' },
    { id: 'technologies', label: 'Technologies', endpoint: '/api/technologies' },
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
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      fetchData(activeTab);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, []);

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
        <h1 className="text-3xl font-bold text-center mb-8">Portfolio Admin Dashboard</h1>
        
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
                {/* Add more forms for other types as needed */}
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
