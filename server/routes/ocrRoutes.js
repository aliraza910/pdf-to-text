const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { processPDF } = require('../controllers/ocrController');

// POST /api/ocr/upload - Upload and process PDF
router.post('/upload', upload.single('pdf'), processPDF);

module.exports = router;
