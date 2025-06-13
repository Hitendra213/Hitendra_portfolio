const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET: Fetch all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: Fetch a single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST: Create a new project
router.post('/', async (req, res) => {
  try {
    const { title, description, technologies, link, featured, order } = req.body;

    if (!title || !description || !link) {
      return res.status(400).json({ msg: 'Title, description, and link are required' });
    }

    let techArray = technologies;
    if (typeof technologies === 'string') {
      try {
        techArray = JSON.parse(technologies);
      } catch (e) {
        techArray = technologies.split(',').map(tech => tech.trim());
      }
    }

    let imageBase64 = '';
    if (req.files?.image) {
      const file = req.files.image;
      if (file.size > 1024 * 1024) {
        return res.status(400).json({ msg: 'Image exceeds 1MB' });
      }
      imageBase64 = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    }

    const newProject = new Project({
      title,
      description,
      technologies: techArray,
      link,
      featured: featured === 'true' || featured === true,
      order: parseInt(order) || 0,
      image: imageBase64 || undefined
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT: Update an existing project
router.put('/:id', async (req, res) => {
  try {
    const { title, description, technologies, link, featured, order } = req.body;

    if (!title || !description || !link) {
      return res.status(400).json({ msg: 'Title, description, and link are required' });
    }

    let techArray = technologies;
    if (typeof technologies === 'string') {
      try {
        techArray = JSON.parse(technologies);
      } catch (e) {
        techArray = technologies.split(',').map(tech => tech.trim());
      }
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    let imageBase64 = '';
    if (req.files?.image) {
      const file = req.files.image;
      if (file.size > 1024 * 1024) {
        return res.status(400).json({ msg: 'Image exceeds 1MB' });
      }
      imageBase64 = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    }

    project.title = title;
    project.description = description;
    project.technologies = techArray;
    project.link = link;
    project.featured = featured === 'true' || featured === true;
    project.order = parseInt(order) || 0;
    project.updatedAt = Date.now();
    if (imageBase64) {
      project.image = imageBase64;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE: Remove a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ msg: 'Project removed' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT: Update project order (batch update)
router.put('/', async (req, res) => {
  try {
    const { projects } = req.body;
    if (!Array.isArray(projects)) {
      return res.status(400).json({ msg: 'Projects must be an array' });
    }

    const updatePromises = projects.map(proj => {
      return Project.findByIdAndUpdate(
        proj.id,
        { $set: { order: proj.order, updatedAt: Date.now() } },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    res.json({ msg: 'Projects order updated' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;