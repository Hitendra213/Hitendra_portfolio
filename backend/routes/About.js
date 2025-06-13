const express = require('express');
const router = express.Router();
const About = require('../models/About');

// GET: Fetch About data
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ msg: 'About data not found' });
    res.json({
      bio: about.bio,
      values: about.values,
      image: about.image,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT: Update About data
router.put('/', async (req, res) => {
  try {
    let { bio, values } = req.body;

    if (typeof values === 'string') {
      try {
        values = JSON.parse(values);
      } catch (parseError) {
        return res.status(400).json({ msg: 'Invalid values format' });
      }
    }

    if (!bio || !Array.isArray(values)) {
      return res.status(400).json({ msg: 'Bio and values array required' });
    }

    let imageBase64 = '';
    if (req.files?.image) {
      const file = req.files.image;
      if (file.size > 1024 * 1024) {
        return res.status(400).json({ msg: 'Image exceeds 1MB' });
      }
      imageBase64 = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    }

    let about = await About.findOne();
    if (!about) {
      about = new About({ bio, values });
    } else {
      about.bio = bio;
      about.values = values;
    }

    if (imageBase64) {
      about.image = imageBase64;
    }

    about.updatedAt = Date.now();
    await about.save();

    res.json({
      bio: about.bio,
      values: about.values,
      image: about.image,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;