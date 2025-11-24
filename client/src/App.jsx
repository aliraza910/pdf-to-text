import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './components/FileUpload';
import OCRResults from './components/OCRResults';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const convertPdfToImages = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const images = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      images.push(blob);
    }
    return images;
  };

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    setError(null);
    setOcrResult(null);
    setStatusMessage('Uploading PDF...');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:5000/api/ocr/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setOcrResult(data);
      } else if (data.isScanned) {
        // Handle scanned PDF fallback
        setStatusMessage('Scanned PDF detected. Converting to images for OCR...');
        try {
          const images = await convertPdfToImages(file);
          let fullText = '';
          
          for (let i = 0; i < images.length; i++) {
            setStatusMessage(`Processing page ${i + 1} of ${images.length}...`);
            const imageFormData = new FormData();
            imageFormData.append('pdf', images[i], `page-${i + 1}.jpg`);
            
            const imgResponse = await fetch('http://localhost:5000/api/ocr/upload', {
              method: 'POST',
              body: imageFormData,
            });
            
            const imgData = await imgResponse.json();
            if (imgData.success) {
              fullText += `\n--- Page ${i + 1} ---\n` + imgData.text + '\n';
            }
          }
          
          setOcrResult({
            success: true,
            text: fullText,
            fileName: file.name,
            message: 'Scanned PDF processed successfully'
          });
          
        } catch (conversionError) {
          console.error('Conversion error:', conversionError);
          setError('Failed to process scanned PDF. Please try a clearer document.');
        }
      } else {
        setError(data.message || 'Failed to process PDF');
      }
    } catch (err) {
      setError('Error connecting to server. Please make sure the backend is running.');
      console.error('Upload error:', err);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleReset = () => {
    setOcrResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 gradient-text">
            OCR My PDF
          </h1>
          <p className="text-xl text-gray-300">
            Extract text from your PDF files with AI-powered OCR technology
          </p>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <LoadingSpinner key="loading" message={statusMessage} />
          ) : ocrResult ? (
            <OCRResults key="results" result={ocrResult} onReset={handleReset} />
          ) : (
            <FileUpload key="upload" onFileUpload={handleFileUpload} />
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="alert alert-error mt-6 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-16 text-gray-400"
        >
          <p>Powered by Tesseract.js • Built with React & Express</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
