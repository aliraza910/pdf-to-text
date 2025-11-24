import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="card bg-base-200 shadow-2xl border-2 border-transparent hover:border-primary transition-all duration-300">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-6 text-center justify-center">
            Upload Your PDF
          </h2>

          <div
            {...getRootProps()}
            className={`
              border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all duration-300 ease-in-out
              ${isDragActive 
                ? 'border-primary bg-primary/10 scale-105' 
                : 'border-gray-600 hover:border-secondary hover:bg-secondary/5'
              }
            `}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* Upload Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 mx-auto mb-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              {isDragActive ? (
                <p className="text-2xl font-semibold text-primary">
                  Drop your PDF here!
                </p>
              ) : (
                <>
                  <p className="text-xl font-semibold mb-2 text-gray-200">
                    Drag & drop your PDF here
                  </p>
                  <p className="text-gray-400 mb-4">or</p>
                  <button className="btn btn-primary btn-lg gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Browse Files
                  </button>
                </>
              )}

              {acceptedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-success/20 rounded-lg border border-success"
                >
                  <p className="text-success font-semibold">
                    ✓ {acceptedFiles[0].name}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Maximum file size: 10MB</p>
            <p className="mt-2">Supported format: PDF</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;
