"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      
      // Simuler la progression
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 100);

      // Nettoyer l'intervalle après 2 secondes max
      setTimeout(() => {
        if (progressInterval) clearInterval(progressInterval);
        setProgress(90);
      }, 2000);
    };

    const completeLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Écouter les clics sur les liens internes
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.hostname === window.location.hostname) {
        if (link.href !== window.location.href) {
          startLoading();
          setTimeout(completeLoading, 800);
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100"
        >
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--rose)' }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
