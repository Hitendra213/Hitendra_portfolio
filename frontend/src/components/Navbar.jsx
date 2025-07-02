import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsHidden(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isHidden ? 'hidden' : ''}`} aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span>Portfolio</span>
        </div>
        <div className="navbar-menu">
          <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
              aria-label="Home page"
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
              aria-label="About page"
            >
              About
            </NavLink>
            <NavLink
              to="/project"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
              aria-label="Projects page"
            >
              Projects
            </NavLink>
            <NavLink
              to="/skill"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
              aria-label="Skills page"
            >
              Skills
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
              aria-label="Blog page"
            >
              Blog
            </NavLink>
            <NavLink
              to="/certificate"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
              aria-label="Certificates page"
            >
              Certificates
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
              aria-label="Contact page"
            >
              Contact
            </NavLink>
          </div>
          <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
            <span className={isOpen ? 'toggle-icon open' : 'toggle-icon'}></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;