import { useState, useEffect } from 'react';
import '../styles/About.css';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const About = () => {
  const [aboutData, setAboutData] = useState({
    bio: '',
    image: '',
    values: [],
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/about`);
        const data = response.data;
        setAboutData({
          bio: data.bio || '',
          image: data.image || 'https://via.placeholder.com/300',
          values: Array.isArray(data.values) ? data.values : [],
        });
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section className="about">
      <div className="about-container">
        <h1 className="about-title">About Me</h1>
        <div className="about-content">
          <div className="about-image">
            <img
              src={aboutData.image}
              alt="Profile"
              className="profile-img"
            />
          </div>
          <div className="about-text">
            <p>{aboutData.bio || 'No bio available.'}</p>
            <div className="about-values">
              {aboutData.values.map((value, index) => (
                <div key={index} className="value-card">
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
            <a
              href="/contact"
              className="about-button"
              aria-label="Navigate to contact page"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;