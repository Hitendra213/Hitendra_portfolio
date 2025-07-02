import { useState } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/Contact.css';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const API_BASE_URL = 'http://localhost:5000';
  const API_BASE_URL = 'https://hitendra-portfolio.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus('');
    setFormError('');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormStatus('');
    setFormError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);
      setFormData({ name: '', email: '', message: '' });
      setFormStatus(response.data.msg);
    } catch (err) {
      setFormError(err.response?.data?.msg || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact" id="contact">
      <Helmet>
        <title>Contact | Hitendrasinh Matroja - Full Stack Developer</title>
        <meta name="description" content="Get in touch with Hitendrasinh Matroja for collaboration or inquiries about web development, MERN stack, Django, or Flutter projects." />
        <meta name="keywords" content="contact full stack developer, Hitendrasinh Matroja, MERN stack, Django, Flutter" />
        <meta property="og:title" content="Contact | Hitendrasinh Matroja - Full Stack Developer" />
        <meta property="og:description" content="Reach out to Hitendrasinh Matroja for project collaborations or inquiries." />
        <meta property="og:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact | Hitendrasinh Matroja - Full Stack Developer" />
        <meta name="twitter:description" content="Reach out to Hitendrasinh Matroja for project collaborations or inquiries." />
        <meta name="twitter:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Contact",
            "description": "Contact page for Hitendrasinh Matroja, a Full Stack Developer.",
            "url": "https://hitendrasinhmatroja.vercel.app/contact",
            "mainEntity": {
              "@type": "Person",
              "name": "Hitendrasinh Matroja",
              "jobTitle": "Full Stack Developer"
            }
          })}
        </script>
      </Helmet>
      <div className="contact-container">
        <h1 className="contact-title">Get in Touch</h1>
        <div className="contact-content">
          <div className="contact-form">
            <p>Have a question or want to collaborate? Drop me a message!</p>
            {formStatus && <p className="form-status">{formStatus}</p>}
            {formError && <p className="form-error">{formError}</p>}
            <div role="form" aria-labelledby="contact-title">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your Message"
                  rows="5"
                  disabled={isSubmitting}
                  aria-required="true"
                ></textarea>
              </div>
              <button
                type="button"
                className="contact-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                aria-label="Send contact message"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>

          <div className="contact-social">
            <h3>Connect with Me</h3>
            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/hitendrasinh-matroja-027413290"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn profile"
              >
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </a>
              <a
                href="https://github.com/Hitendra213"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub profile"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
              <a
                href="https://www.instagram.com/_hitendra_07_"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram profile"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;