const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');

// Process PDF and extract text using OCR
const processPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const filePath = req.file.path;
    console.log('Processing file:', filePath);

    // Check if file is an image
    if (req.file.mimetype.startsWith('image/')) {
      console.log('Image detected, running Tesseract OCR...');
      const { data: { text } } = await Tesseract.recognize(
        filePath,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );
      
      // Clean up
      await fs.unlink(filePath);

      return res.json({
        success: true,
        text: text,
        fileName: req.file.originalname,
        message: 'Image OCR completed successfully',
      });
    }

    // Read PDF file
    const dataBuffer = await fs.readFile(filePath);
    
    // First, try to extract text directly from PDF
    let extractedText = '';
    try {
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
      console.log('Direct text extraction successful');
      console.log('Extracted text length:', extractedText.length);
    } catch (err) {
      console.log('Direct extraction failed:', err.message);
    }

    // Check if we got meaningful text
    if (!extractedText || extractedText.trim().length < 10) {
      // Clean up - delete uploaded file
      await fs.unlink(filePath);
      
      return res.status(400).json({
        success: false,
        isScanned: true, // Flag to tell frontend to try client-side conversion
        message: 'Scanned PDF detected. Switching to image-based processing...',
        text: extractedText || '',
      });
    }

    // Clean up - delete uploaded file
    await fs.unlink(filePath);

    // Send response
    res.json({
      success: true,
      text: extractedText,
      fileName: req.file.originalname,
      message: 'OCR processing completed successfully',
    });

  } catch (error) {
    console.error('OCR Error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error processing PDF: ' + error.message,
    });
  }
};

module.exports = {
  processPDF,
};
