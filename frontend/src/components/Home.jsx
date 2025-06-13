import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            image: aboutResponse.data.image || 'https://via.placeholder.com/300',
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
            image: 'https://via.placeholder.com/300',
          },
          projects: [
            {
              _id: 1,
              title: 'AI Chatbot',
              description: 'A machine learning-based chatbot for real-time user interaction.',
              image: 'https://via.placeholder.com/300',
              technologies: ['Python', 'TensorFlow', 'React'],
              link: '#',
            },
            {
              _id: 2,
              title: 'Portfolio Website',
              description: 'A responsive portfolio showcasing my CSE projects.',
              image: 'https://via.placeholder.com/300',
              technologies: ['React', 'Node.js', 'CSS'],
              link: '#',
            },
            {
              _id: 3,
              title: 'Sorting Visualizer',
              description: 'An interactive tool to visualize sorting algorithms.',
              image: 'https://via.placeholder.com/300',
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
      <section className="home animate-section">
        <div className="loading animate-content">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="home animate-section">
        <div className="error animate-content">{error}</div>
      </section>
    );
  }

  return (
    <section className="home animate-section">
      <div className="hero animate-content">
        <h1 className="hero-title neon-text">Hi, I'm Hitendrasinh Matroja</h1>
        <p className="hero-subtitle">
          A <span className="highlight">Full Stack Developer</span> passionate about crafting scalable web and mobile applications using the <strong>MERN stack</strong>, <strong>Django</strong>, and modern frontend frameworks like <strong>React.js</strong> and <strong>Flutter</strong>.
        </p>
        <p className="hero-subtitle">
          I specialize in building responsive user interfaces, developing RESTful APIs, and optimizing workflows using tools like <strong>Git</strong> and <strong>Android Studio</strong>. I enjoy solving real-world problems with clean, efficient code.
        </p>
        <Link to="/contact" className="hero-button animate-button">Get in Touch</Link>
      </div>


      <div className="home-section about-section animate-content">
        <h2 className="section-title neon-text">About Me</h2>
        <div className="about-content">
          <img src={data.about.image} alt="Profile" className="about-image animate-image" />
          <div className="about-text">
            <p>{data.about.bio.substring(0, 200)}...</p>
            <Link to="/about" className="section-button animate-button">Discover My Journey</Link>
          </div>
        </div>
      </div>

      <div className="home-section projects-section animate-content">
        <h2 className="section-title neon-text">Featured Projects</h2>
        <div className="projects-grid">
          {data.projects.map(project => (
            <div key={project._id} className="project-card animate-card">
              {project.image && <img src={project.image} alt={project.title} className="project-image animate-image" />}
              <h3>{project.title}</h3>
              <p>{project.description.substring(0, 100)}...</p>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag animate-tag">{tech}</span>
                ))}
              </div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="section-button animate-button">Explore Project</a>
            </div>
          ))}
        </div>
        <Link to="/project" className="section-button view-all animate-button">View All Projects</Link>
      </div>

      <div className="home-section skills-section animate-content">
        <h2 className="section-title neon-text">My Skills</h2>
        <div className="skills-grid">
          {data.skills.map((category, index) => (
            <div key={index} className="skill-card animate-card">
              <h3>{category.category}</h3>
              <ul className="skill-list">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex} className="skill-item animate-item">{skill.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link to="/skill" className="section-button view-all animate-button">See All Skills</Link>
      </div>

      <div className="home-section activity-section animate-content">
        <h2 className="section-title neon-text">Recent Achievements</h2>
        <div className="activity-grid">
          {data.recentActivities.map((activity, index) => (
            <div key={activity.id} className="activity-card animate-card">
              <p>{activity.action}</p>
              <span className="activity-date animate-date">{activity.date}</span>
            </div>
          ))}
        </div>
        <Link to="/contact" className="section-button view-all animate-button">Let’s Connect</Link>
      </div>
    </section>
  );
};

export default Home;