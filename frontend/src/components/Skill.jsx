import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import '../styles/Skill.css';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://hitendra-portfolio.onrender.com';

const Skill = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/skill`);
        
        const groupedSkills = response.data.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        }, {});
        
        const formattedCategories = Object.keys(groupedSkills).map(category => ({
          category,
          skills: groupedSkills[category].sort((a, b) => a.order - b.order).map(skill => ({
            name: skill.name,
            icon: skill.icon,
            proficiency: skill.proficiency
          }))
        }));
        
        setSkillCategories(formattedCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
        
        setSkillCategories([
          {
            category: 'Frontend',
            skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'].map(name => ({ name })),
          },
          {
            category: 'Backend',
            skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'].map(name => ({ name })),
          },
          {
            category: 'Tools & Others',
            skills: ['Git', 'Docker', 'Webpack', 'VS Code'].map(name => ({ name })),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <main className="skill">
        <div className="skill-container">
          <h1 className="skill-title">My Skills</h1>
          <div className="loading-spinner">Loading skills...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="skill">
      <Helmet>
        <title>Skills | Hitendrasinh Matroja - Full Stack Developer</title>
        <meta name="description" content="Explore Hitendrasinh Matroja's skills in MERN stack, Django, Flutter, and other web development technologies." />
        <meta name="keywords" content="full stack developer skills, MERN stack, Django, Flutter, web development, Hitendrasinh Matroja" />
        <meta property="og:title" content="Skills | Hitendrasinh Matroja - Full Stack Developer" />
        <meta property="og:description" content="View the technical skills of Hitendrasinh Matroja, including MERN stack, Django, and Flutter." />
        <meta property="og:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app/skill" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Skills | Hitendrasinh Matroja - Full Stack Developer" />
        <meta name="twitter:description" content="View the technical skills of Hitendrasinh Matroja, including MERN stack, Django, and Flutter." />
        <meta name="twitter:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Skills by Hitendrasinh Matroja",
            "description": "Technical skills of Hitendrasinh Matroja in full-stack development.",
            "url": "https://hitendrasinhmatroja.vercel.app/skill",
            "itemListElement": skillCategories.map((category, index) => ({
              "@type": "ItemList",
              "position": index + 1,
              "name": category.category,
              "itemListElement": category.skills.map((skill, skillIndex) => ({
                "@type": "Thing",
                "position": skillIndex + 1,
                "name": skill.name
              }))
            }))
          })}
        </script>
      </Helmet>
      <div className="skill-container">
        <h1 className="skill-title">My Skills</h1>
        <div className="skill-content">
          <p>Here's a rundown of the technologies and tools I use to build robust and scalable web applications.</p>
          {error && <p className="error-message">{error}</p>}
          <div className="skill-grid">
            {skillCategories.map((category, index) => (
              <article key={index} className="skill-card">
                <h3>{category.category}</h3>
                <ul className="skill-list">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="skill-item">
                      {skill.icon && (
                        <span className="skill-icon">
                          {skill.icon.startsWith('http') ? (
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              loading="lazy"
                              onError={(e) => (e.target.src = 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png')}
                            />
                          ) : (
                            <i className={`fa ${skill.icon}`}></i>
                          )}
                        </span>
                      )}
                      <span className="skill-name">{skill.name}</span>
                      {skill.proficiency !== undefined && (
                        <div className="skill-proficiency">
                          <div className="proficiency-bar">
                            <div
                              className="proficiency-fill"
                              style={{ width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Skill;