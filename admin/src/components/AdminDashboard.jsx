import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admindashboard">
      <div className="admindashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your portfolio content</p>
      </div>
      <div className="admindashboard-nav-grid">
        <div className="nav-card">
          <Link to="/about">About</Link>
          <p>Edit your personal and professional information</p>
        </div>
        <div className="nav-card">
          <Link to="/project">Projects</Link>
          <p>Manage your project portfolio</p>
        </div>
        <div className="nav-card">
          <Link to="/skill">Skills</Link>
          <p>Add or update your technical skills</p>
        </div>
        <div className="nav-card">
          <Link to="/blog">Blog</Link>
          <p>Create and edit blog posts</p>
        </div>
        <div className="nav-card">
          <Link to="/certificates">Certificates</Link>
          <p>Manage your certifications</p>
        </div>
        <div className="nav-card">
          <Link to="/contact">Contact</Link>
          <p>Review and respond to contact messages</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;