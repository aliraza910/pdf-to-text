import { useState } from 'react';
import { motion } from 'framer-motion';

const OCRResults = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const handleDownload = () => {
  //   if (!result || !result.text) {
  //     console.error('No text to download');
  //     return;
  //   }

  //   try {
  //     // Create blob
  //     const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
      
  //     // Determine filename
  //     let fileName = 'extracted_text.txt';
  //     if (result.fileName) {
  //       // Remove extension if present and append _extracted.txt
  //       const baseName = result.fileName.replace(/\.[^/.]+$/, "");
  //       fileName = `${baseName}_extracted.txt`;
  //     }
      
  //     console.log('Attempting to download:', fileName); // Debug log

  //     // Create link
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', fileName); // Explicitly set attribute
      
  //     // Append to body (required for Firefox)
  //     document.body.appendChild(link);
      
  //     // Trigger click
  //     link.click();
      
  //     // Cleanup
  //     setTimeout(() => {
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(url);
  //     }, 100);
      
  //   } catch (err) {
  //     console.error('Download failed:', err);
  //     alert('Failed to download file. Please try copying the text instead.');
  //   }
  // };

  const handleDownload = () => {
  if (!result || !result.text) {
    console.error('No text to download');
    return;
  }

  try {
    // Create blob
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });

    // Determine filename
    let fileName = 'extracted_text.txt';
    if (result.fileName) {
      const baseName = result.fileName.replace(/\.[^/.]+$/, "");
      fileName = `${baseName}_extracted.txt`;
    }
    // Ensure it ends with .txt
    if (!fileName.toLowerCase().endsWith('.txt')) {
      fileName += '.txt';
    }

    console.log('Attempting to download:', fileName);

    // Create link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Set download attribute

    // Append, click, and cleanup
    document.body.appendChild(link);
    link.click();

    // Delay cleanup to ensure download triggers
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 500); // increased delay from 100ms to 500ms

  } catch (err) {
    console.error('Download failed:', err);
    alert('Failed to download file. Please try copying the text instead.');
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="card bg-base-200 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="card-title text-3xl gradient-text">
                Extraction Complete!
              </h2>
              <p className="text-gray-400 mt-2">
                File: <span className="text-secondary font-semibold">{result.fileName}</span>
              </p>
            </div>
            
            <button
              onClick={onReset}
              className="btn btn-ghost btn-circle btn-lg"
              title="Upload another file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="btn btn-primary flex-1 gap-2"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Text
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="btn btn-secondary flex-1 gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download TXT
            </motion.button>
          </div>

          {/* Text Display */}
          <div className="bg-base-300 rounded-xl p-6 border-2 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-primary">Extracted Text</h3>
              <div className="badge badge-accent badge-lg">
                {result.text.length} characters
              </div>
            </div>

            <div className="bg-base-100 rounded-lg p-6 max-h-96 overflow-y-auto custom-scrollbar">
              <pre className="whitespace-pre-wrap font-mono text-sm text-white leading-relaxed">
                {result.text || 'No text found in the PDF.'}
              </pre>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 mt-6"
          >
            <div className="stat bg-base-300 rounded-lg">
              <div className="stat-title">Words</div>
              <div className="stat-value text-primary text-2xl">
                {result.text.split(/\s+/).filter(word => word.length > 0).length}
              </div>
            </div>
            
            <div className="stat bg-base-300 rounded-lg">
              <div className="stat-title">Lines</div>
              <div className="stat-value text-secondary text-2xl">
                {result.text.split('\n').length}
              </div>
            </div>
            
            <div className="stat bg-base-300 rounded-lg">
              <div className="stat-title">Characters</div>
              <div className="stat-value text-accent text-2xl">
                {result.text.length}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OCRResults;
