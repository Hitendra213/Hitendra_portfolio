const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date, required: true },
  link: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', CertificateSchema);