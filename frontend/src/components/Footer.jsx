import { Helmet } from 'react-helmet';
import '../styles/Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hitendrasinh Matroja Portfolio",
            "url": "https://hitendrasinhmatroja.vercel.app",
            "sameAs": [
              "https://www.linkedin.com/in/hitendrasinh-matroja-027413290",
              "https://github.com/Hitendra213",
              "https://www.instagram.com/_hitendra_07_"
            ]
          })}
        </script>
      </Helmet>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-contact">
            <h3 className="footer-title">Get in Touch</h3>
            <p>
              Have a project in mind?{' '}
              <a href="mailto:hitendrasinhmatroja21@gmail.com" className="contact-link" aria-label="Email Hitendrasinh">
                Send me an email
              </a>
            </p>
          </div>

          <div className="footer-social">
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

          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} Hitendrasinh Matroja. All rights reserved.</p>
          </div>
        </div>

        <div className="footer-back-to-top">
          <button onClick={scrollToTop} className="back-to-top-button" aria-label="Scroll to top">
            <i className="fas fa-chevron-up"></i>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
