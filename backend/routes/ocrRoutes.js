const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const OCRResult = require('../models/OCRResult');

const router = express.Router();

// ✅ Ensure 'uploads/' directory exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Configure Multer storage
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// ✅ OCR Processing Route
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imagePath = path.resolve(req.file.path); // ✅ Get absolute path
        console.log(`Processing file: ${imagePath}`);

        // ✅ Run OCR script
        exec(`python3 ./scripts/ocr_processor.py "${imagePath}"`, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
            if (error) {
                console.error(`OCR Error: ${error.message}`);
                return res.status(500).json({ error: 'OCR processing failed' });
            }
            if (stderr) {
                console.error(`OCR Stderr: ${stderr}`);
            }

            try {
                const parsedOutput = JSON.parse(stdout.trim()); // ✅ Parse the JSON response
                const extractedText = parsedOutput.text; // ✅ Extract the text field

                console.log(`OCR Extracted Text: ${extractedText}`);

                // ✅ Save to MongoDB
                const newOCRResult = new OCRResult({ imagePath, extractedText });
                await newOCRResult.save();

                res.json({ success: true, text: extractedText });
            } catch (jsonError) {
                console.error(`JSON Parse Error: ${jsonError.message}`);
                res.status(500).json({ error: 'Failed to parse OCR result' });
            }
        });

    } catch (err) {
        console.error(`Unexpected Server Error: ${err.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Export the router
module.exports = router;
