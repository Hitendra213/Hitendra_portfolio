import { useState, useEffect, useRef } from 'react';
import '../styles/AdminBlog.css';
import axios from 'axios';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPost, setCurrentPost] = useState({
    id: null,
    title: '',
    content: '',
    link: '',
    author: '',
    date: '',
    image: '',
  });
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const API_BASE_URL = 'http://localhost:5000';
  const API_BASE_URL = 'https://hitendra-portfolio.onrender.com';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/blog`);
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost({
      ...currentPost,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      setFormError('Image exceeds 1MB');
      return;
    }
    setCurrentPost({ ...currentPost, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPost.title || !currentPost.author || !currentPost.date || !currentPost.content) {
      setFormError('Title, author, date, and content are required');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('title', currentPost.title);
      formData.append('author', currentPost.author);
      formData.append('date', currentPost.date);
      formData.append('content', currentPost.content);
      if (currentPost.link) formData.append('link', currentPost.link);
      if (currentPost.image && typeof currentPost.image !== 'string') {
        formData.append('image', currentPost.image);
      }

      const url = isEditing
        ? `${API_BASE_URL}/api/blog/${currentPost.id}`
        : `${API_BASE_URL}/api/blog`;
      const method = isEditing ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      resetForm();
      fetchPosts();
    } catch (err) {
      setFormError(err.response?.data?.msg || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setCurrentPost({
      id: post._id,
      title: post.title,
      author: post.author,
      date: post.date ? new Date(post.date).toISOString().split('T')[0] : '',
      content: post.content,
      link: post.link || '',
      image: post.image || '',
    });
    setIsEditing(true);
    document.querySelector('.admin-blog-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/api/blog/${id}`);
        await fetchPosts();
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentPost({
      id: null,
      title: '',
      content: '',
      link: '',
      author: '',
      date: '',
      image: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditing(false);
    setFormError('');
  };

  return (
    <div className="admin-blog">
      <div className="admin-blog-header">
        <h1>Blog Administration</h1>
        <p>Manage your blog posts</p>
      </div>

      <div className="admin-blog-container">
        <div className="admin-blog-form-container">
          <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
          <form className="admin-blog-form" onSubmit={handleSubmit}>
            {formError && <div className="form-error">{formError}</div>}

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={currentPost.title}
                onChange={handleInputChange}
                required
                maxLength="200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={currentPost.author}
                onChange={handleInputChange}
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={currentPost.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={currentPost.content}
                onChange={handleInputChange}
                required
                rows="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link">Link (Optional)</label>
              <input
                type="url"
                id="link"
                name="link"
                value={currentPost.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Featured Image</label>
              <input
                type="file"
                id="image"
                name="image"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
              />
              {isEditing && currentPost.image && typeof currentPost.image === 'string' && (
                <div className="current-image">
                  <small>Current image:</small>
                  <img
                    src={currentPost.image}
                    alt="Current featured"
                    style={{ maxHeight: '100px', marginTop: '5px' }}
                    onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                  />
                </div>
              )}
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-save" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-blog-list">
          <h2>Existing Posts</h2>
          {loading ? (
            <p>Loading posts...</p>
          ) : error ? (
            <p className="error-message">Error: {error}</p>
          ) : posts.length === 0 ? (
            <p>No posts found. Create your first post!</p>
          ) : (
            <div className="admin-posts-grid">
              {posts.map((post) => (
                <div key={post._id} className="admin-post-card">
                  {post.image && (
                    <div className="admin-post-image">
                      <img
                        src={post.image}
                        alt={post.title}
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                    </div>
                  )}
                  <h3>{post.title || 'Untitled'}</h3>
                  <p className="admin-post-date">
                    {post.date ? new Date(post.date).toLocaleDateString() : 'No date'}
                  </p>
                  <p className="admin-post-excerpt">
                    {post.content ? post.content.substring(0, 100) + '...' : 'No content'}
                  </p>
                  <div className="admin-post-actions">
                    <button className="btn-edit" onClick={() => handleEdit(post)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(post._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;