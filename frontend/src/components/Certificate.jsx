import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/Certificate.css';
import axios from 'axios';

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);

  // const API_BASE_URL = 'http://localhost:5000';
  const API_BASE_URL = 'https://hitendra-portfolio.onrender.com';

  const fetchCertificates = async () => {
    try {
      console.log('Fetching certificates from:', `${API_BASE_URL}/api/certificates`);
      const response = await axios.get(`${API_BASE_URL}/api/certificates`);
      setCertificates(response.data);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error.message, error.response?.status);
      setError(`Failed to load certificates: ${error.response?.status || ''} ${error.response?.data?.msg || error.message}`);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <main className="certificate">
      <Helmet>
        <title>Certificates | Hitendrasinh Matroja - Full Stack Developer</title>
        <meta name="description" content="View professional certifications earned by Hitendrasinh Matroja in web development, MERN stack, Django, and Flutter." />
        <meta name="keywords" content="certifications, full stack developer, MERN stack, Django, Flutter, Hitendrasinh Matroja" />
        <meta property="og:title" content="Certificates | Hitendrasinh Matroja - Full Stack Developer" />
        <meta property="og:description" content="Explore certifications earned by Hitendrasinh Matroja in web development and programming." />
        <meta property="og:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app/certificate" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Certificates | Hitendrasinh Matroja - Full Stack Developer" />
        <meta name="twitter:description" content="Explore certifications earned by Hitendrasinh Matroja in web development and programming." />
        <meta name="twitter:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Certificates",
            "description": "Certificates earned by Hitendrasinh Matroja in web development and programming.",
            "url": "https://hitendrasinhmatroja.vercel.app/certificate",
            "mainEntity": certificates.map(certificate => ({
              "@type": "CreativeWork",
              "name": certificate.title,
              "publisher": {
                "@type": "Organization",
                "name": certificate.issuer
              },
              "datePublished": certificate.date ? new Date(certificate.date).toISOString() : new Date().toISOString(),
              "image": certificate.image || "https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png",
              "url": certificate.link || "https://hitendrasinhmatroja.vercel.app/certificate"
            }))
          })}
        </script>
      </Helmet>
      <div className="certificate-container">
        <h1 className="certificate-title">My Certificates</h1>
        <div className="certificate-content">
          <p>View my professional certifications earned through rigorous training and assessments.</p>
          {error && <p className="error-message">{error}</p>}
          <div className="certificate-grid">
            {certificates.length === 0 && !error && <p>No certificates available</p>}
            {certificates.map((certificate) => (
              <article key={certificate._id} className="certificate-card">
                <h3>{certificate.title}</h3>
                <p className="certificate-issuer">Issued by: {certificate.issuer}</p>
                <time className="certificate-date" dateTime={new Date(certificate.date).toISOString()}>
                  Date: {new Date(certificate.date).toLocaleDateString()}
                </time>
                {certificate.image && (
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="certificate-image"
                    loading="lazy"
                    onError={(e) => (e.target.src = 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png')}
                  />
                )}
                <a
                  href={certificate.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="certificate-button"
                  aria-label={`View ${certificate.title} certificate`}
                >
                  View Certificate
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Certificate;