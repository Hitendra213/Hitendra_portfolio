import { useState, useEffect } from 'react';
import '../styles/Blog.css';
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/blog`);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load posts: ${err.response?.data?.msg || err.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="blog">
        <div className="blog-container">
          <h1 className="blog-title">My Blog</h1>
          <div className="blog-loading">Loading posts...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blog">
        <div className="blog-container">
          <h1 className="blog-title">My Blog</h1>
          <div className="blog-error">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog">
      <div className="blog-container">
        <h1 className="blog-title">My Blog</h1>
        <div className="blog-content">
          <p>Read my latest articles on web development, technology, and more.</p>
          <div className="blog-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="blog-card">
                  {post.image && (
                    <div className="blog-image-container">
                      <img
                        src={post.image}
                        alt={post.title || 'Blog post image'}
                        className="blog-image"
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                    </div>
                  )}
                  <h3>{post.title || 'Untitled'}</h3>
                  <p className="blog-date">
                    {post.date ? new Date(post.date).toLocaleDateString() : 'No date'}
                  </p>
                  <p>{post.content ? post.content.substring(0, 100) + '...' : 'No content'}</p>
                  <a
                    href={post.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-button"
                  >
                    Read More
                  </a>
                </div>
              ))
            ) : (
              <p className="blog-empty">No blog posts found. Check back soon!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;