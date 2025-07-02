import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/About.css';
import axios from 'axios';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://hitendra-portfolio.onrender.com';

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
          image: data.image || 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png',
          values: Array.isArray(data.values) ? data.values : [],
        });
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <main className="about">
      <Helmet>
        <title>About | Hitendrasinh Matroja - Full Stack Developer</title>
        <meta name="description" content="Learn about Hitendrasinh Matroja, a Full Stack Developer with expertise in MERN stack, Django, and Flutter." />
        <meta name="keywords" content="about full stack developer, Hitendrasinh Matroja, MERN stack, Django, Flutter" />
        <meta property="og:title" content="About | Hitendrasinh Matroja - Full Stack Developer" />
        <meta property="og:description" content="Discover the journey and values of Hitendrasinh Matroja, a passionate Full Stack Developer." />
        <meta property="og:image" content={aboutData.image || 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png'} />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app/about" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "About",
            "description": "About page of Hitendrasinh Matroja's portfolio, detailing his journey as a Full Stack Developer.",
            "url": "https://hitendrasinhmatroja.vercel.app/about",
            "mainEntity": {
              "@type": "Person",
              "name": "Hitendrasinh Matroja",
              "jobTitle": "Full Stack Developer"
            }
          })}
        </script>
      </Helmet>
      <div className="about-container">
        <h1 className="about-title">About Me</h1>
        <article className="about-content">
          <div className="about-image">
            <img
              src={aboutData.image}
              alt="Hitendrasinh Matroja Profile"
              className="profile-img"
              loading="lazy"
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
              aria-label="Contact Hitendrasinh"
            >
              Get in Touch
            </a>
          </div>
        </article>
      </div>
    </main>
  );
};

export default About;