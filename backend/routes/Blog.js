const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Test endpoint to confirm route is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Blog route working' });
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create blog
router.post('/', async (req, res) => {
  const { title, author, date, link, content } = req.body;

  try {
    if (!title || !author || !date || !content) {
      return res.status(400).json({ msg: 'Title, author, date, and content required' });
    }

    let imageBase64 = '';
    if (req.files?.image) {
      const file = req.files.image;
      if (file.size > 1024 * 1024) {
        return res.status(400).json({ msg: 'Image exceeds 1MB' });
      }
      imageBase64 = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    }

    const blog = new Blog({
      title,
      author,
      date: new Date(date),
      link: link || undefined,
      content: content || undefined,
      image: imageBase64 || undefined,
      createdAt: new Date(),
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  const { title, author, date, link, content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    blog.title = title || blog.title;
    blog.author = author || blog.author;
    blog.date = date ? new Date(date) : blog.date;
    blog.link = link || blog.link;
    blog.content = content || blog.content;
    blog.createdAt = new Date(); // Update createdAt on modification

    if (req.files?.image) {
      const file = req.files.image;
      if (file.size > 1024 * 1024) {
        return res.status(400).json({ msg: 'Image exceeds 1MB' });
      }
      blog.image = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });

    await blog.deleteOne();
    res.json({ msg: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;