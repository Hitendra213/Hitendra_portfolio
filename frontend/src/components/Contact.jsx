import { useState } from 'react';
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

  const API_BASE_URL = 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus('');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <section className="contact" id="contact">
      <div className="contact-container">
        <h1 className="contact-title">Get in Touch</h1>
        <div className="contact-content">
          <div className="contact-form">
            <p>Have a question or want to collaborate? Drop me a message!</p>
            {formStatus && <p className="form-status">{formStatus}</p>}
            {formError && <p className="form-error">{formError}</p>}
            <form onSubmit={handleSubmit}>
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
                ></textarea>
              </div>
              <button type="submit" className="contact-button" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="contact-social">
            <h3>Connect with Me</h3>
            <div className="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                GitHub
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;