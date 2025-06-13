const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Test endpoint to confirm route is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Contact route working' });
});

// Submit contact form (public)
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'Name, email, and message are required' });
    }
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ msg: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update contact status
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });
    if (status && !['pending', 'resolved'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    contact.status = status || contact.status;
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });
    await contact.deleteOne();
    res.json({ msg: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;