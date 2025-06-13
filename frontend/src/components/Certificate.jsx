import { useState, useEffect } from 'react';
import '../styles/Certificate.css';
import axios from 'axios';

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);

  // Explicit backend URL
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
    <section className="certificate">
      <div className="certificate-container">
        <h1 className="certificate-title">My Certificates</h1>
        <div className="certificate-content">
          <p>View my professional certifications earned through rigorous training and assessments.</p>
          {error && <p className="error-message">{error}</p>}
          <div className="certificate-grid">
            {certificates.length === 0 && !error && <p>No certificates available</p>}
            {certificates.map((certificate) => (
              <div key={certificate._id} className="certificate-card">
                <h3>{certificate.title}</h3>
                <p className="certificate-issuer">Issued by: {certificate.issuer}</p>
                <p className="certificate-date">Date: {new Date(certificate.date).toLocaleDateString()}</p>
                {certificate.image && (
                  <img src={certificate.image} alt={certificate.title} className="certificate-image" />
                )}
                <a href={certificate.link || '#'} target="_blank" rel="noopener noreferrer" className="certificate-button">
                  View Certificate
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificate;