const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// Test endpoint to confirm route is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Certificate route working' });
});

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create certificate
router.post('/', async (req, res) => {
  const { title, issuer, date, link } = req.body;

  try {
    if (!title || !issuer || !date) {
      return res.status(400).json({ msg: 'Title, issuer, and date required' });
    }

    let imageBase64 = '';
    if (req.files?.image) {
      const file = req.files.image;
      if (file.size > 1024 * 1024) {
        return res.status(400).json({ msg: 'Image exceeds 1MB' });
      }
      imageBase64 = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    }

    const certificate = new Certificate({
      title,
      issuer,
      date: new Date(date),
      link: link || undefined,
      image: imageBase64 || undefined,
      createdAt: new Date(),
    });

    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update certificate
router.put('/:id', async (req, res) => {
  const { title, issuer, date, link } = req.body;

  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ msg: 'Certificate not found' });

    certificate.title = title || certificate.title;
    certificate.issuer = issuer || certificate.issuer;
    certificate.date = date ? new Date(date) : certificate.date;
    certificate.link = link || certificate.link;
    certificate.createdAt = new Date(); // Update createdAt on modification

    if (req.files?.image) {
      const file = req.files.image;
      if (file.size > 1024 * 1024) {
        return res.status(400).json({ msg: 'Image exceeds 1MB' });
      }
      certificate.image = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    }

    await certificate.save();
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete certificate
router.delete('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ msg: 'Certificate not found' });

    await certificate.deleteOne();
    res.json({ msg: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;