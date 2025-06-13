import { useState, useEffect } from 'react';
import '../styles/AdminAbout.css';
import axios from 'axios';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://hitendra-portfolio.onrender.com';

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    bio: '',
    image: null,
    values: [{ title: '', description: '' }],
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/about`);
        setFormData({
          bio: response.data.bio || '',
          image: null,
          values:
            Array.isArray(response.data.values) && response.data.values.length > 0
              ? response.data.values
              : [{ title: '', description: '' }],
        });
        setPreviewImage(response.data.image || null);
      } catch (error) {
        console.error('Error fetching about data:', error);
        setError('Failed to load about data');
      }
    };
    fetchAboutData();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value, dataset } = e.target;

    if (dataset.field) {
      const newValues = [...formData.values];
      newValues[index][dataset.field] = value;
      setFormData({ ...formData, values: newValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const addValue = () => {
    setFormData({
      ...formData,
      values: [...formData.values, { title: '', description: '' }],
    });
  };

  const removeValue = (index) => {
    const newValues = formData.values.filter((_, i) => i !== index);
    setFormData({ ...formData, values: newValues });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Create a new FormData instance
    const data = new FormData();
    
    // Append the simple string value
    data.append('bio', formData.bio);
    
    // Stringify the values array and append
    data.append('values', JSON.stringify(formData.values));
    
    // Check and append the image file if it exists
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // Use axios with correct content type handling
      const response = await axios.put(`${BASE_URL}/api/about`, data, {
        headers: {
          // Let axios set the Content-Type header automatically
          // It will set it to 'multipart/form-data' and include the boundary
        },
        // Add timeout and other configurations
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      alert('About page updated successfully!');
      setPreviewImage(response.data.image || previewImage);
      setLoading(false);
    } catch (error) {
      console.error('Error updating about data:', error);
      setError(error.response?.data?.msg || 'Failed to update About page');
      setLoading(false);
      alert('Failed to update About page. Please try again.');
    }
  };

  return (
    <div className="admin-about">
      <h1>Edit About Page</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-about-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Profile Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="image-preview" />
          )}
        </div>

        <div className="form-group">
          <label>Values</label>
          {formData.values.map((value, index) => (
            <div key={index} className="value-group">
              <input
                type="text"
                placeholder="Title"
                value={value.title}
                data-field="title"
                onChange={(e) => handleInputChange(e, index)}
              />
              <textarea
                placeholder="Description"
                value={value.description}
                data-field="description"
                onChange={(e) => handleInputChange(e, index)}
              />
              {formData.values.length > 1 && (
                <button
                  type="button"
                  className="remove-value"
                  onClick={() => removeValue(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-value" onClick={addValue}>
            Add Value
          </button>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminAbout;