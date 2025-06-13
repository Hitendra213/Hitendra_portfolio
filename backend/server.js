const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
try {
  app.use('/api/about', require('./routes/About'));
  app.use('/api/project', require('./routes/Project'));
  app.use('/api/skill', require('./routes/Skill'));
  app.use('/api/blog', require('./routes/Blog'));
  app.use('/api/certificates', require('./routes/Certificate'));
  app.use('/api/contact', require('./routes/Contact'));
  console.log('Routes loaded');
} catch (error) {
  console.error('Route loading error:', error.message);
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;