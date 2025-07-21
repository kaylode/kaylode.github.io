import React, { useState, useEffect } from 'react'
import Grid from './reusable/grid'

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        // Map database fields to expected format for Grid component
        const mappedProjects = data.map(project => ({
          id: project.id,
          img: project.image || '/projects/github.png', // fallback image
          title: project.title,
          desc: project.description,
          source: project.githubUrl || project.liveUrl || '#',
          demo: project.liveUrl || '',
          color: project.featured ? 'primary' : 'light',
          text_color: project.featured ? 'light' : 'dark',
          tags: project.technologies ? project.technologies.reduce((acc, tech) => {
            acc[tech] = 'secondary'; // default color for tech tags
            return acc;
          }, {}) : {}
        }));
        
        console.log('Original data:', data);
        console.log('Mapped projects:', mappedProjects);
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

  if (loading) {
    return (
      <div className="bg-gray-800 w-full py-5 px-5 flex flex-col justify-center">
        <div className="px-5 container">
          <div className="px-5 text-white text-center">
            <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
              Projects
            </p>
            <p className="py-6">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      name="projects"
      className="bg-gray-800 w-full py-5 px-5 flex flex-col justify-center">
      <div className="px-5 container">
        <div className="px-5  text-white">

          <div className="justify-center text-center">
            <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
              Projects
            </p>
            <p className="py-6">These are the personal projects that I did in free time</p>
            <p className="text-sm text-gray-400">Projects count: {projects.length}</p>
          </div>
          
          {/* Debug: Simple list to test data */}
          <div className="mb-8">
            <h3 className="text-xl mb-4">Debug: Projects List</h3>
            {projects.map(project => (
              <div key={project.id} className="mb-2 p-2 bg-gray-700 rounded">
                <h4 className="font-bold">{project.title}</h4>
                <p className="text-sm">{project.desc}</p>
              </div>
            ))}
          </div>
          
          <Grid list={projects} />

        </div>
      </div>
    </div>
  )
}

export default Projects