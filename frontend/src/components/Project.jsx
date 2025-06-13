import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Project.css';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://hitendra-portfolio.onrender.com';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/project`);
        // Sort projects by featured status (featured first) and then by order
        const sortedProjects = response.data.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.order - b.order;
        });
        setProjects(sortedProjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="project">
        <div className="project-container">
          <h1 className="project-title">My Projects</h1>
          <div className="loading-spinner">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="project">
        <div className="project-container">
          <h1 className="project-title">My Projects</h1>
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="project">
      <div className="project-container">
        <h1 className="project-title">My Projects</h1>
        <div className="project-content">
          <p>Explore some of my recent work, showcasing my skills in full-stack development and modern web technologies.</p>
          
          {/* Featured Projects */}
          {projects.some(project => project.featured) && (
            <div className="featured-projects">
              <h2>Featured Projects</h2>
              <div className="project-grid featured-grid">
                {projects
                  .filter(project => project.featured)
                  .map((project) => (
                    <div key={project._id} className="project-card featured-card">
                      {project.image && (
                        <div className="project-image">
                          <img src={project.image} alt={project.title} />
                        </div>
                      )}
                      <div className="project-info">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="project-tech">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-button">
                          View Project
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* All Projects or Other Projects */}
          <div className="all-projects">
            {projects.some(project => project.featured) ? <h2>Other Projects</h2> : <h2>All Projects</h2>}
            <div className="project-grid">
              {projects
                .filter(project => !project.featured)
                .map((project) => (
                  <div key={project._id} className="project-card">
                    {project.image && (
                      <div className="project-image">
                        <img src={project.image} alt={project.title} />
                      </div>
                    )}
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-button">
                      View Project
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;