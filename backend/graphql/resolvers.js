const OCRResult = require('../models/OCRResult');
const axios = require('axios');

const resolvers = {
  Query: {
    getResults: async () => await OCRResult.find(),
  },
  Mutation: {
    uploadImage: async (_, { imageUrl }) => {
      try {
        const { data } = await axios.post('http://localhost:5000/process', { imageUrl });
        const newResult = new OCRResult({ imageUrl, text: data.text });
        await newResult.save();
        return newResult;
      } catch (error) {
        throw new Error('OCR Processing Failed');
      }
    },
  },
};

module.exports = resolvers;
