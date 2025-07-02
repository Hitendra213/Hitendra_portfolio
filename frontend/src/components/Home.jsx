import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import '../styles/Home.css';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://hitendra-portfolio.onrender.com';

const Home = () => {
  const [data, setData] = useState({
    about: { bio: '', image: '' },
    projects: [],
    skills: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const aboutResponse = await axios.get(`${BASE_URL}/api/about`);
        const projectResponse = await axios.get(`${BASE_URL}/api/project`);
        const skillResponse = await axios.get(`${BASE_URL}/api/skill`);
        const certificateResponse = await axios.get(`${BASE_URL}/api/certificates`);
        const blogResponse = await axios.get(`${BASE_URL}/api/blog`);

        const sortedProjects = projectResponse.data
          .sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.order - b.order;
          })
          .slice(0, 3);

        const groupedSkills = skillResponse.data.reduce((acc, skill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill);
          return acc;
        }, {});
        const formattedSkills = Object.keys(groupedSkills)
          .map(category => ({
            category,
            skills: groupedSkills[category]
              .sort((a, b) => a.order - b.order)
              .slice(0, 4),
          }))
          .slice(0, 2);

        const activities = [
          ...projectResponse.data.map(project => ({
            id: project._id,
            action: `Developed project: ${project.title}`,
            date: new Date(project.createdAt).toLocaleDateString(),
            createdAt: new Date(project.createdAt),
          })),
          ...skillResponse.data.map(skill => ({
            id: skill._id,
            action: `Mastered skill: ${skill.name} (${skill.category})`,
            date: new Date(skill.createdAt).toLocaleDateString(),
            createdAt: new Date(skill.createdAt),
          })),
          ...certificateResponse.data.map(certificate => ({
            id: certificate._id,
            action: `Earned certificate: ${certificate.title}`,
            date: new Date(certificate.createdAt).toLocaleDateString(),
            createdAt: new Date(certificate.createdAt),
          })),
          ...blogResponse.data.map(blog => ({
            id: blog._id,
            action: `Wrote blog: ${blog.title}`,
            date: new Date(blog.createdAt).toLocaleDateString(),
            createdAt: new Date(blog.createdAt),
          })),
        ];

        const sortedActivities = activities
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 3);

        setData({
          about: {
            bio: aboutResponse.data.bio || 'I’m a BTech CSE student passionate about crafting innovative solutions through code. I love exploring web development, AI, and algorithms to build impactful projects.',
            image: aboutResponse.data.image || 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png',
          },
          projects: sortedProjects,
          skills: formattedSkills,
          recentActivities: sortedActivities,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Displaying default values.');
        setData({
          about: {
            bio: 'I’m a BTech CSE student passionate about crafting innovative solutions through code. I love exploring web development, AI, and algorithms to build impactful projects.',
            image: 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png',
          },
          projects: [
            {
              _id: 1,
              title: 'AI Chatbot',
              description: 'A machine learning-based chatbot for real-time user interaction.',
              image: 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png',
              technologies: ['Python', 'TensorFlow', 'React'],
              link: '#',
            },
            {
              _id: 2,
              title: 'Portfolio Website',
              description: 'A responsive portfolio showcasing my CSE projects.',
              image: 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png',
              technologies: ['React', 'Node.js', 'CSS'],
              link: '#',
            },
            {
              _id: 3,
              title: 'Sorting Visualizer',
              description: 'An interactive tool to visualize sorting algorithms.',
              image: 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png',
              technologies: ['JavaScript', 'HTML', 'CSS'],
              link: '#',
            },
          ],
          skills: [
            {
              category: 'Programming',
              skills: [
                { name: 'Python' },
                { name: 'JavaScript' },
                { name: 'Java' },
                { name: 'C++' },
              ],
            },
            {
              category: 'Web Development',
              skills: [
                { name: 'React' },
                { name: 'Node.js' },
                { name: 'HTML' },
                { name: 'CSS' },
              ],
            },
          ],
          recentActivities: [
            { id: 1, action: 'Won 2nd place in Hackathon 2025', date: '2025-05-20', createdAt: new Date('2025-05-20') },
            { id: 2, action: 'Contributed to open-source on GitHub', date: '2025-05-15', createdAt: new Date('2025-05-15') },
            { id: 3, action: 'Completed DSA course on LeetCode', date: '2025-05-10', createdAt: new Date('2025-05-10') },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="home animate-section">
        <div className="loading animate-content">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home animate-section">
        <div className="error animate-content">{error}</div>
      </main>
    );
  }

  return (
    <main className="home animate-section">
      <Helmet>
        <title>Home | Hitendrasinh Matroja - Full Stack Developer</title>
        <meta name="description" content="Welcome to Hitendrasinh Matroja's portfolio. Explore my MERN stack projects, Django applications, and Flutter mobile apps." />
        <meta name="keywords" content="full stack developer portfolio, MERN stack projects, Django developer, Flutter apps, web development" />
        <meta property="og:title" content="Home | Hitendrasinh Matroja - Full Stack Developer" />
        <meta property="og:description" content="Discover Hitendrasinh Matroja's portfolio featuring MERN stack, Django, and Flutter projects." />
        <meta property="og:image" content={data.about.image || 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png'} />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Home",
            "description": "Portfolio homepage of Hitendrasinh Matroja, showcasing full stack development projects.",
            "url": "https://hitendrasinhmatroja.vercel.app",
            "mainEntity": {
              "@type": "Person",
              "name": "Hitendrasinh Matroja",
              "jobTitle": "Full Stack Developer"
            }
          })}
        </script>
      </Helmet>
      <section className="hero animate-content">
        <h1 className="hero-title neon-text">Hi, I'm Hitendrasinh Matroja</h1>
        <p className="hero-subtitle">
          A <span className="highlight">Full Stack Developer</span> passionate about crafting scalable web and mobile applications using the <strong>MERN stack</strong>, <strong>Django</strong>, and modern frontend frameworks like <strong>React.js</strong> and <strong>Flutter</strong>.
        </p>
        <p className="hero-subtitle">
          I specialize in building responsive user interfaces, developing RESTful APIs, and optimizing workflows using tools like <strong>Git</strong> and <strong>Android Studio</strong>. I enjoy solving real-world problems with clean, efficient code.
        </p>
        <Link to="/contact" className="hero-button animate-button" aria-label="Contact Hitendrasinh">Get in Touch</Link>
      </section>

      <section className="home-section about-section animate-content">
        <h2 className="section-title neon-text">About Me</h2>
        <article className="about-content">
          <img src={data.about.image} alt="Hitendrasinh Matroja Profile" className="about-image animate-image" loading="lazy" />
          <div className="about-text">
            <p>{data.about.bio.substring(0, 200)}...</p>
            <Link to="/about" className="section-button animate-button" aria-label="Learn more about Hitendrasinh">Discover My Journey</Link>
          </div>
        </article>
      </section>

      <section className="home-section projects-section animate-content">
        <h2 className="section-title neon-text">Featured Projects</h2>
        <div className="projects-grid">
          {data.projects.map(project => (
            <article key={project._id} className="project-card animate-card">
              {project.image && <img src={project.image} alt={`${project.title} screenshot`} className="project-image animate-image" loading="lazy" />}
              <h3>{project.title}</h3>
              <p>{project.description.substring(0, 100)}...</p>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag animate-tag">{tech}</span>
                ))}
              </div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="section-button animate-button" aria-label={`Explore ${project.title}`}>Explore Project</a>
            </article>
          ))}
        </div>
        <Link to="/project" className="section-button view-all animate-button" aria-label="View all projects">View all projects</Link>
      </section>

      <section className="home-section skills-section animate-content">
        <h2 className="section-title neon-text">My Skills</h2>
        <div className="skills-grid">
          {data.skills.map((category, index) => (
            <article key={index} className="skill-card animate-card">
              <h3>{category.category}</h3>
              <ul className="skill-list">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex} className="skill-item animate-item">{skill.name}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Link to="/skill" className="section-button view-all animate-button" aria-label="View all skills">See All Skills</Link>
      </section>

      <section className="home-section activity-section animate-content">
        <h2 className="section-title neon-text">Recent Achievements</h2>
        <div className="activity-grid">
          {data.recentActivities.map((activity, index) => (
            <article key={activity.id} className="activity-card animate-card">
              <p>{activity.action}</p>
              <time className="activity-date animate-date" dateTime={activity.date}>{activity.date}</time>
            </article>
          ))}
        </div>
        <Link to="/contact" className="section-button view-all animate-button" aria-label="Connect with Hitendrasinh">Let’s Connect</Link>
      </section>
    </main>
  );
};

export default Home;