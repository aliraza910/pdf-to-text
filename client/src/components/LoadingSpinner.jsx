import { motion } from 'framer-motion';

const LoadingSpinner = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-8 border-transparent border-t-primary border-r-secondary"
        />
        
        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute top-4 left-4 w-24 h-24 rounded-full border-8 border-transparent border-b-accent border-l-info"
        />

        {/* Center pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h3 className="text-2xl font-bold gradient-text mb-2">
          {message || 'Processing Your PDF'}
        </h3>
        <p className="text-gray-400">
          Extracting text using OCR technology...
        </p>
        
        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-primary rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
