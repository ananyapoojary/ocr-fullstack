const mongoose = require('mongoose');

const OCRResultSchema = new mongoose.Schema({
  imageUrl: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OCRResult', OCRResultSchema);
