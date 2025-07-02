import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import '../styles/Project.css';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://hitendra-portfolio.onrender.com';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/project`);
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
      <main className="project">
        <div className="project-container">
          <h1 className="project-title">My Projects</h1>
          <div className="loading-spinner">Loading projects...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="project">
        <div className="project-container">
          <h1 className="project-title">My Projects</h1>
          <div className="error-message">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="project">
      <Helmet>
        <title>Projects | Hitendrasinh Matroja - Full Stack Developer</title>
        <meta name="description" content="Explore Hitendrasinh Matroja's projects built with MERN stack, Django, and Flutter, showcasing full-stack development skills." />
        <meta name="keywords" content="full stack projects, MERN stack projects, Django projects, Flutter apps, Hitendrasinh Matroja" />
        <meta property="og:title" content="Projects | Hitendrasinh Matroja - Full Stack Developer" />
        <meta property="og:description" content="Discover Hitendrasinh Matroja's portfolio of full-stack projects using MERN stack, Django, and Flutter." />
        <meta property="og:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app/project" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects | Hitendrasinh Matroja - Full Stack Developer" />
        <meta name="twitter:description" content="Discover Hitendrasinh Matroja's portfolio of full-stack projects using MERN stack, Django, and Flutter." />
        <meta name="twitter:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Projects by Hitendrasinh Matroja",
            "description": "A collection of full-stack development projects by Hitendrasinh Matroja.",
            "url": "https://hitendrasinhmatroja.vercel.app/project",
            "itemListElement": projects.map((project, index) => ({
              "@type": "CreativeWork",
              "position": index + 1,
              "name": project.title,
              "description": project.description,
              "url": project.link || "https://hitendrasinhmatroja.vercel.app/project",
              "image": project.image || "https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png"
            }))
          })}
        </script>
      </Helmet>
      <div className="project-container">
        <h1 className="project-title">My Projects</h1>
        <div className="project-content">
          <p>Explore some of my recent work, showcasing my skills in full-stack development and modern web technologies.</p>
          
          {projects.some(project => project.featured) && (
            <section className="featured-projects">
              <h2>Featured Projects</h2>
              <div className="project-grid featured-grid">
                {projects
                  .filter(project => project.featured)
                  .map((project) => (
                    <article key={project._id} className="project-card featured-card">
                      {project.image && (
                        <div className="project-image">
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            onError={(e) => (e.target.src = 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png')}
                          />
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
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-button"
                          aria-label={`View ${project.title} project`}
                        >
                          View Project
                        </a>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          )}
          
          <section className="all-projects">
            {projects.some(project => project.featured) ? <h2>Other Projects</h2> : <h2>All Projects</h2>}
            <div className="project-grid">
              {projects
                .filter(project => !project.featured)
                .map((project) => (
                  <article key={project._id} className="project-card">
                    {project.image && (
                      <div className="project-image">
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          onError={(e) => (e.target.src = 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png')}
                        />
                      </div>
                    )}
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-button"
                      aria-label={`View ${project.title} project`}
                    >
                      View Project
                    </a>
                  </article>
                ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Project;