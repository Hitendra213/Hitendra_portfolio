import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Sidebar';
import Dashboard from './components/AdminDashboard';
import About from './components/AdminAbout';
import Project from './components/AdminProject';
import Skill from './components/AdminSkill';
import Blog from './components/AdminBlog';
import Certificate from './components/AdminCertificate';
import Contact from './components/AdminContact';
import './App.css';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar isOpen={isSidebarOpen} />
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/certificates" element={<Certificate />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
