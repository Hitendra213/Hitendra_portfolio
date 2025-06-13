import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminProject.css';

const BASE_URL = 'http://localhost:5000';

const AdminProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    image: null,
    featured: false,
    order: 0
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch all projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/project`);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      link: '',
      image: null,
      featured: false,
      order: projects.length
    });
    setPreviewImage(null);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleAddNew = () => {
    resetForm();
    setFormData(prev => ({ ...prev, order: projects.length }));
    setShowForm(true);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      link: project.link,
      image: null,
      featured: project.featured,
      order: project.order
    });
    setPreviewImage(project.image);
    setShowForm(true);
    setEditingProject(project._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await axios.delete(`${BASE_URL}/api/project/${id}`);
      setProjects(projects.filter(project => project._id !== id));
      resetForm();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('technologies', formData.technologies);
    data.append('link', formData.link);
    data.append('featured', formData.featured);
    data.append('order', formData.order);
    
    if (formData.image) {
      data.append('image', formData.image);
    }
    
    try {
      let response;
      
      if (editingProject) {
        // Update existing project
        response = await axios.put(`${BASE_URL}/api/project/${editingProject}`, data, {
          headers: {} // Let axios set the proper Content-Type
        });
        
        setProjects(projects.map(p => 
          p._id === editingProject ? response.data : p
        ));
      } else {
        // Create new project
        response = await axios.post(`${BASE_URL}/api/project`, data, {
          headers: {} // Let axios set the proper Content-Type  
        });
        
        setProjects([...projects, response.data]);
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const moveProject = async (id, direction) => {
    const currentIndex = projects.findIndex(p => p._id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === projects.length - 1)
    ) {
      return; // Can't move further
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedProjects = [...projects];
    
    // Swap the projects
    [updatedProjects[currentIndex], updatedProjects[newIndex]] = 
    [updatedProjects[newIndex], updatedProjects[currentIndex]];
    
    // Update order properties
    updatedProjects.forEach((project, index) => {
      project.order = index;
    });
    
    setProjects(updatedProjects);
    
    // Update in backend
    try {
      await axios.put(`${BASE_URL}/api/project`, {
        projects: updatedProjects.map(item => ({
          id: item._id,
          order: item.order
        }))
      });
    } catch (err) {
      console.error('Error updating project order:', err);
      // Revert to original order on error
      fetchProjects();
    }
  };

  if (loading && projects.length === 0) {
    return <div className="admin-projects loading">Loading projects...</div>;
  }

  return (
    <div className="admin-projects">
      <div className="admin-header">
        <h1>Manage Projects</h1>
        <button 
          className="add-project-btn"
          onClick={handleAddNew}
        >
          Add New Project
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm && (
        <div className="project-form-container">
          <form onSubmit={handleSubmit} className="project-form" encType="multipart/form-data">
            <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
            
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="technologies">Technologies (comma separated)</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="link">Project Link</label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Project Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <div className="image-preview-container">
                  <img src={previewImage} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured">Featured Project</label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="projects-list-container">
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <p className="no-projects">No projects found. Add your first project!</p>
        ) : (
          <div className="projects-list">
            {projects.map((project, index) => (
              <div 
                key={project._id}
                className="project-item"
              >
                <div className="project-content">
                  <div className="project-move-controls">
                    <button 
                      className="move-btn"
                      onClick={() => moveProject(project._id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button 
                      className="move-btn"
                      onClick={() => moveProject(project._id, 'down')}
                      disabled={index === projects.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                  <div className="project-details">
                    <h3 className="project-title">
                      {project.title}
                      {project.featured && <span className="featured-badge">Featured</span>}
                    </h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tech-tags">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  {project.image && (
                    <div className="project-thumbnail">
                      <img src={project.image} alt={project.title} />
                    </div>
                  )}
                </div>
                <div className="project-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProject;