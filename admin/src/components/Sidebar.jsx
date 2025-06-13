// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar-container">
        <div className="sidebar-brand">
          <span>Portfolio</span>
        </div>
        <nav className="sidebar-links" role="navigation" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <span className="icon">🏠</span>
            <span className="label">Home</span>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <span className="icon">ℹ️</span>
            <span className="label">About</span>
          </NavLink>
          <NavLink to="/project" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <span className="icon">📂</span>
            <span className="label">Projects</span>
          </NavLink>
          <NavLink to="/skill" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <span className="icon">🛠️</span>
            <span className="label">Skills</span>
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <span className="icon">📝</span>
            <span className="label">Blog</span>
          </NavLink>
          <NavLink to="/certificates" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <span className="icon">🏆</span>
            <span className="label">Certificates</span>
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            <span className="icon">📞</span>
            <span className="label">Contact</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;