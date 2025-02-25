const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const ocrRoutes = require('./routes/ocrRoutes'); // Import OCR routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use OCR routes
app.use('/api', ocrRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
