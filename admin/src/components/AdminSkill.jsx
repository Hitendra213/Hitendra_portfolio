import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminSkill.css';

const BASE_URL = 'http://localhost:5000';

const AdminSkill = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    icon: '',
    proficiency: 75,
    order: 0
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Fetch all skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/skill`);
      setSkills(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(skill => skill.category))];
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      icon: '',
      proficiency: 75,
      order: skills.length
    });
    setEditingSkill(null);
    setShowForm(false);
    setShowNewCategoryInput(false);
    setNewCategory('');
  };

  const handleAddNew = () => {
    resetForm();
    setFormData(prev => ({ ...prev, order: skills.length }));
    setShowForm(true);
    setEditingSkill(null);
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || '',
      proficiency: skill.proficiency,
      order: skill.order
    });
    setShowForm(true);
    setEditingSkill(skill._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await axios.delete(`${BASE_URL}/api/skill/${id}`);
      setSkills(skills.filter(skill => skill._id !== id));
      resetForm();
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill. Please try again.');
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setFormData({...formData, category: newCategory.trim()});
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      
      if (editingSkill) {
        // Update existing skill
        response = await axios.put(`${BASE_URL}/api/skill/${editingSkill}`, formData);
        
        setSkills(skills.map(s => 
          s._id === editingSkill ? response.data : s
        ));
      } else {
        // Create new skill
        response = await axios.post(`${BASE_URL}/api/skill`, formData);
        
        setSkills([...skills, response.data]);
        
        // Add new category if it doesn't exist
        if (!categories.includes(response.data.category)) {
          setCategories([...categories, response.data.category]);
        }
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Error saving skill:', err);
      setError('Failed to save skill. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const moveSkill = async (id, direction) => {
    // Find skills in the same category
    const skill = skills.find(s => s._id === id);
    const categorySkills = skills.filter(s => s.category === skill.category);
    const currentIndex = categorySkills.findIndex(s => s._id === id);
    
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === categorySkills.length - 1)
    ) {
      return; // Can't move further within category
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedCategorySkills = [...categorySkills];
    
    // Swap the skills
    [updatedCategorySkills[currentIndex], updatedCategorySkills[newIndex]] = 
    [updatedCategorySkills[newIndex], updatedCategorySkills[currentIndex]];
    
    // Update order properties
    updatedCategorySkills.forEach((skill, index) => {
      skill.order = index;
    });
    
    // Update the main skills array
    const updatedSkills = skills.map(s => {
      const updatedSkill = updatedCategorySkills.find(us => us._id === s._id);
      return updatedSkill || s;
    });
    
    setSkills(updatedSkills);
    
    // Update in backend
    try {
      await axios.put(`${BASE_URL}/api/skill`, {
        skills: updatedCategorySkills.map(item => ({
          id: item._id,
          order: item.order
        }))
      });
    } catch (err) {
      console.error('Error updating skill order:', err);
      // Revert to original order on error
      fetchSkills();
    }
  };

  if (loading && skills.length === 0) {
    return <div className="admin-skills loading">Loading skills...</div>;
  }

  // Group skills by category
  const skillsByCategory = categories.reduce((acc, category) => {
    acc[category] = skills.filter(skill => skill.category === category)
      .sort((a, b) => a.order - b.order);
    return acc;
  }, {});

  return (
    <div className="admin-skills">
      <div className="admin-header">
        <h1>Manage Skills</h1>
        <button 
          className="add-skill-btn"
          onClick={handleAddNew}
        >
          Add New Skill
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm && (
        <div className="skill-form-container">
          <form onSubmit={handleSubmit} className="skill-form">
            <h2>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
            
            <div className="form-group">
              <label htmlFor="name">Skill Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              {showNewCategoryInput ? (
                <div className="new-category-input">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddCategory}
                    className="add-category-btn"
                  >
                    Add
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowNewCategoryInput(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="category-selector">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setShowNewCategoryInput(true)}
                    className="new-category-btn"
                  >
                    New Category
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="icon">Icon (FontAwesome class or URL)</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="e.g. fa-react or https://example.com/icon.svg"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="proficiency">Proficiency (0-100)</label>
              <div className="range-input">
                <input
                  type="range"
                  id="proficiency"
                  name="proficiency"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={handleInputChange}
                />
                <span className="proficiency-value">{formData.proficiency}%</span>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving...' : editingSkill ? 'Update Skill' : 'Add Skill'}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="skills-list-container">
        <h2>Your Skills</h2>
        {skills.length === 0 ? (
          <p className="no-skills">No skills found. Add your first skill!</p>
        ) : (
          <div className="skills-by-category">
            {categories.map((category) => (
              <div key={category} className="category-section">
                <h3 className="category-title">{category}</h3>
                <div className="skills-list">
                  {skillsByCategory[category].map((skill, index) => (
                    <div 
                      key={skill._id}
                      className="skill-item"
                    >
                      <div className="skill-content">
                        <div className="skill-move-controls">
                          <button 
                            className="move-btn"
                            onClick={() => moveSkill(skill._id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button 
                            className="move-btn"
                            onClick={() => moveSkill(skill._id, 'down')}
                            disabled={index === skillsByCategory[category].length - 1}
                          >
                            ↓
                          </button>
                        </div>
                        <div className="skill-details">
                          <h4 className="skill-name">{skill.name}</h4>
                          {skill.icon && (
                            <div className="skill-icon">
                              {skill.icon.startsWith('http') ? (
                                <img src={skill.icon} alt={skill.name} />
                              ) : (
                                <i className={`fa ${skill.icon}`}></i>
                              )}
                            </div>
                          )}
                          <div className="skill-proficiency">
                            <div className="proficiency-bar">
                              <div 
                                className="proficiency-fill" 
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                            <span className="proficiency-text">{skill.proficiency}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="skill-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(skill)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(skill._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSkill;