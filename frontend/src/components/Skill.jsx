
import { useState, useEffect } from 'react';
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
        
        // Group skills by category
        const groupedSkills = response.data.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        }, {});
        
        // Convert to array format
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
        
        // Fallback to default skills if API fails
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
      <section className="skill">
        <div className="skill-container">
          <h1 className="skill-title">My Skills</h1>
          <div className="loading-spinner">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="skill">
      <div className="skill-container">
        <h1 className="skill-title">My Skills</h1>
        <div className="skill-content">
          <p>Here's a rundown of the technologies and tools I use to build robust and scalable web applications.</p>
          <div className="skill-grid">
            {skillCategories.map((category, index) => (
              <div key={index} className="skill-card">
                <h3>{category.category}</h3>
                <ul className="skill-list">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="skill-item">
                      {skill.icon && (
                        <span className="skill-icon">
                          {skill.icon.startsWith('http') ? (
                            <img src={skill.icon} alt={skill.name} />
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skill;