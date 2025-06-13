const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  category: { 
    type: String, 
    required: true,
    trim: true 
  },
  icon: { 
    type: String,
    trim: true 
  },
  proficiency: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: 75 
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', SkillSchema);