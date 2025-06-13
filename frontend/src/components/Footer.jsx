import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span>Portfolio</span>
        </div>
        <div className="footer-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            About
          </NavLink>
          <NavLink
            to="/project"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Projects
          </NavLink>
          <NavLink
            to="/skill"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Skills
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Blog
          </NavLink>
          <NavLink
            to="/certificate"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Certificates
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Contact
          </NavLink>
        </div>
        <div className="footer-social">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Hitendrasinh Matroja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;