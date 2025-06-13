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

  // Reset isHidden on route change
  useEffect(() => {
    setIsHidden(false);
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [location.pathname]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isHidden ? 'hidden' : ''}`}>
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
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/project"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
            >
              Projects
            </NavLink>
            <NavLink
              to="/skill"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
            >
              Skills
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
            >
              Blog
            </NavLink>
            <NavLink
              to="/certificate"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
            >
              Certificates
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>
          </div>
          <button className="navbar-toggle" onClick={toggleMenu}>
            <span className={isOpen ? 'toggle-icon open' : 'toggle-icon'}></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;