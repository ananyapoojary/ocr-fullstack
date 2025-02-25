const mongoose = require('mongoose');

const OCRResultSchema = new mongoose.Schema({
  imagePath: String,
  extractedText: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OCRResult', OCRResultSchema);
