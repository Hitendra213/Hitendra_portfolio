const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  bio: { type: String, required: true },
  image: { type: String },
  values: [
    {
      title: String,
      description: String,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('About', AboutSchema);