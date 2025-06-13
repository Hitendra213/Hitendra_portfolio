const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// GET: Fetch all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json(skills);
  } catch (error) {
    console.error('GET /api/skill error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: Fetch skills grouped by category
router.get('/categories', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    
    // Group skills by category
    const categories = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
    
    // Convert to array format for easier frontend consumption
    const result = Object.keys(categories).map(category => ({
      category,
      skills: categories[category]
    }));
    
    res.json(result);
  } catch (error) {
    console.error('GET /api/skill/categories error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET: Fetch a single skill by ID
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    console.error(`GET /api/skill/${req.params.id} error:`, error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST: Create a new skill
router.post('/', async (req, res) => {
  try {
    const { name, category, icon, proficiency, order } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ msg: 'Name and category are required' });
    }
    
    // Create new skill
    const newSkill = new Skill({
      name,
      category,
      icon: icon || '',
      proficiency: proficiency || 75,
      order: order || 0
    });
    
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    console.error('POST /api/skill error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// PUT: Update an existing skill
router.put('/:id', async (req, res) => {
  try {
    const { name, category, icon, proficiency, order } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ msg: 'Name and category are required' });
    }
    
    // Find skill
    let skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    
    // Update fields
    skill.name = name;
    skill.category = category;
    skill.icon = icon || skill.icon;
    skill.proficiency = proficiency !== undefined ? proficiency : skill.proficiency;
    skill.order = order !== undefined ? order : skill.order;
    skill.updatedAt = Date.now();
    
    await skill.save();
    res.json(skill);
  } catch (error) {
    console.error(`PUT /api/skill/${req.params.id} error:`, error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// DELETE: Remove a skill
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    
    await skill.deleteOne();
    
    res.json({ msg: 'Skill removed' });
  } catch (error) {
    console.error(`DELETE /api/skill/${req.params.id} error:`, error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// PUT: Update skill order (batch update)
router.put('/', async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ msg: 'Skills must be an array' });
    }
    
    // Update each skill order
    const updatePromises = skills.map(skill => {
      return Skill.findByIdAndUpdate(
        skill.id,
        { $set: { order: skill.order, updatedAt: Date.now() } },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({ msg: 'Skills order updated' });
  } catch (error) {
    console.error('PUT /api/skill (batch update) error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

module.exports = router;