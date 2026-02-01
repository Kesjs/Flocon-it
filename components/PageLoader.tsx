"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
  isLoading: boolean;
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Délai réduit pour voir le loader plus rapidement
      const timer = setTimeout(() => setShowLoader(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Logo animé */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 0.9, 1.2, 1],
                rotateZ: [0, 5, -5, 0],
                opacity: [0.8, 1, 0.9, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1]
              }}
              className="w-20 h-20 rounded-full flex items-center justify-center "
             
            >
              <img
                src="/logof.jpg?v=1"
                alt="Flocon"
                className="w-18 h-18 rounded-full object-cover"
              />
            </motion.div>
            
            {/* Points de chargement */}
            {/* <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--rose)' }}
                />
              ))}
            </div> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
