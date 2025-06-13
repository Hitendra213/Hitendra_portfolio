import { useState, useEffect } from 'react';
import '../styles/AdminCertificate.css';
import axios from 'axios';

const AdminCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    link: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Explicit backend URL
  // const API_BASE_URL = 'http://localhost:5000';
  const API_BASE_URL = 'https://hitendra-portfolio.onrender.com';

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      console.log('Fetching certificates from:', `${API_BASE_URL}/api/certificates`);
      const response = await axios.get(`${API_BASE_URL}/api/certificates`);
      setCertificates(response.data);
      setError(null);
    } catch (error) {
      console.error('Fetch error:', error.message, error.response?.status);
      setError(`Failed to load certificates: ${error.response?.status || ''} ${error.response?.data?.msg || error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      setError('Image exceeds 1MB');
      return;
    }
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.issuer || !formData.date) {
      setError('Title, issuer, and date required');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('issuer', formData.issuer);
    data.append('date', formData.date);
    data.append('link', formData.link);
    if (formData.image) data.append('image', formData.image);

    console.log('Submitting to:', `${API_BASE_URL}/api/certificates`);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/certificates/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Certificate updated');
      } else {
        await axios.post(`${API_BASE_URL}/api/certificates`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Certificate added');
      }
      await fetchCertificates();
      resetForm();
    } catch (error) {
      console.error('Save error:', error.message, error.response?.status);
      setError(`Failed to save certificate: ${error.response?.status || ''} ${error.response?.data?.msg || error.message}`);
    }
  };

  const handleEdit = (certificate) => {
    setEditingId(certificate._id);
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      date: new Date(certificate.date).toISOString().split('T')[0],
      link: certificate.link || '',
      image: null,
    });
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting certificate:', id);
      await axios.delete(`${API_BASE_URL}/api/certificates/${id}`);
      setSuccess('Certificate deleted');
      await fetchCertificates();
    } catch (error) {
      console.error('Delete error:', error.message, error.response?.status);
      setError(`Failed to delete certificate: ${error.response?.status || ''} ${error.response?.data?.msg || error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', issuer: '', date: '', link: '', image: null });
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="AdminCertificate">
      <h1>Manage Certificates</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="certificate-form">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Certificate Title"
          required
        />
        <input
          type="text"
          name="issuer"
          value={formData.issuer}
          onChange={handleInputChange}
          placeholder="Issuer"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="url"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          placeholder="Certificate URL (optional)"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Certificate</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div className="certificate-list">
        {certificates.length === 0 && !error && <p>No certificates available</p>}
        {certificates.map((certificate) => (
          <div key={certificate._id} className="certificate-item">
            <h3>{certificate.title}</h3>
            <p>Issuer: {certificate.issuer}</p>
            <p>Date: {new Date(certificate.date).toLocaleDateString()}</p>
            {certificate.link && (
              <p><a href={certificate.link} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
            )}
            {certificate.image && (
              <img src={certificate.image} alt={certificate.title} className="certificate-image" />
            )}
            <button onClick={() => handleEdit(certificate)}>Edit</button>
            <button onClick={() => handleDelete(certificate._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCertificate;