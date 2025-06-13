import { useState, useEffect } from 'react';
import '../styles/AdminContact.css';
import axios from 'axios';

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/contact`);
      setContacts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/contact/${id}`, { status: newStatus });
      setContacts(contacts.map(contact =>
        contact._id === id ? response.data : contact
      ));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/contact/${id}`);
        setContacts(contacts.filter(contact => contact._id !== id));
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete contact');
      }
    }
  };

  return (
    <div className="admin-contact">
      <div className="admin-contact-header">
        <h1>Contact Management</h1>
        <p>Manage incoming contact messages</p>
      </div>

      <div className="admin-contact-container">
        {loading ? (
          <p>Loading contacts...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          <div className="admin-contacts-grid">
            {contacts.map((contact) => (
              <div key={contact._id} className="admin-contact-card">
                <h3>{contact.name || 'No name'}</h3>
                <p className="admin-contact-email">{contact.email || 'No email'}</p>
                <p className="admin-contact-message">{contact.message || 'No message'}</p>
                <p className="admin-contact-date">
                  {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'No date'}
                </p>
                <div className="admin-contact-status">
                  <label>Status: </label>
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                    disabled={isUpdating}
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="admin-contact-actions">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(contact._id)}
                    disabled={isUpdating}
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

export default AdminContact;