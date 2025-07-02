import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/Blog.css';
import axios from 'axios';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const API_BASE_URL = 'http://localhost:5000';
  const API_BASE_URL = 'https://hitendra-portfolio.onrender.com';

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
      <main className="blog">
        <div className="blog-container">
          <h1 className="blog-title">My Blog</h1>
          <div className="blog-loading">Loading posts...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="blog">
        <div className="blog-container">
          <h1 className="blog-title">My Blog</h1>
          <div className="blog-error">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="blog">
      <Helmet>
        <title>Blog | Hitendrasinh Matroja - Full Stack Developer</title>
        <meta name="description" content="Read Hitendrasinh Matroja's blog posts on web development, MERN stack, Django, Flutter, and more." />
        <meta name="keywords" content="web development blog, MERN stack tutorials, Django tips, Flutter guides, Hitendrasinh Matroja" />
        <meta property="og:title" content="Blog | Hitendrasinh Matroja - Full Stack Developer" />
        <meta property="og:description" content="Explore articles on web development, MERN stack, Django, and Flutter by Hitendrasinh Matroja." />
        <meta property="og:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Hitendrasinh Matroja - Full Stack Developer" />
        <meta name="twitter:description" content="Explore articles on web development, MERN stack, Django, and Flutter by Hitendrasinh Matroja." />
        <meta name="twitter:image" content="https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Hitendrasinh Matroja's Blog",
            "description": "Blog posts by Hitendrasinh Matroja on web development, MERN stack, Django, and Flutter.",
            "url": "https://hitendrasinhmatroja.vercel.app/blog",
            "author": {
              "@type": "Person",
              "name": "Hitendrasinh Matroja"
            },
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title || "Untitled",
              "datePublished": post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
              "description": post.content ? post.content.substring(0, 100) + '...' : "No content",
              "image": post.image || "https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png",
              "url": post.link || "https://hitendrasinhmatroja.vercel.app/blog",
              "author": {
                "@type": "Person",
                "name": "Hitendrasinh Matroja"
              }
            }))
          })}
        </script>
      </Helmet>
      <div className="blog-container">
        <h1 className="blog-title">My Blog</h1>
        <div className="blog-content">
          <p>Read my latest articles on web development, technology, and more.</p>
          <div className="blog-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post._id} className="blog-card">
                  {post.image && (
                    <div className="blog-image-container">
                      <img
                        src={post.image}
                        alt={post.title || 'Blog post image'}
                        className="blog-image"
                        loading="lazy"
                        onError={(e) => (e.target.src = 'https://hitendrasinhmatroja.vercel.app/apple-touch-icon.png')}
                      />
                    </div>
                  )}
                  <h3>{post.title || 'Untitled'}</h3>
                  <time className="blog-date" dateTime={post.date ? new Date(post.date).toISOString() : undefined}>
                    {post.date ? new Date(post.date).toLocaleDateString() : 'No date'}
                  </time>
                  <p>{post.content ? post.content.substring(0, 100) + '...' : 'No content'}</p>
                  <a
                    href={post.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-button"
                    aria-label={`Read more about ${post.title || 'this blog post'}`}
                  >
                    Read More
                  </a>
                </article>
              ))
            ) : (
              <p className="blog-empty">No blog posts found. Check back soon!</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Blog;