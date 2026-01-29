"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startLoading = () => {
      if (isLoading) return; // Éviter les chargements multiples
      
      setIsLoading(true);
      setProgress(0);
      startTimeRef.current = Date.now();
      
      // Progression basée sur le temps réel
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const expectedDuration = 800; // Durée attendue en ms
        const newProgress = Math.min((elapsed / expectedDuration) * 95, 95);
        
        setProgress(newProgress);
        
        // Arrêter si on atteint 95%
        if (newProgress >= 95) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      }, 50); // Mise à jour toutes les 50ms pour plus de fluidité
    };

    const completeLoading = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      // Aller directement à 100%
      setProgress(100);
      
      // Disparaître après un court délai
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 150);
    };

    // Détecter le début de navigation
    const handleNavigationStart = () => {
      startLoading();
      // Timeout de sécurité pour compléter le chargement
      setTimeout(completeLoading, 2000);
    };

    // Écouter les clics sur les liens
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.hostname === window.location.hostname) {
        if (link.href !== window.location.href && !link.target) {
          handleNavigationStart();
        }
      }
    };

    // Écouter les événements de navigation du navigateur
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      handleNavigationStart();
      setTimeout(completeLoading, 300);
      return originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      handleNavigationStart();
      setTimeout(completeLoading, 300);
      return originalReplaceState.apply(history, args);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100"
          style={{ zIndex: 60 }}
        >
          <motion.div
            className="h-full"
            style={{ 
              backgroundColor: 'var(--rose)',
              boxShadow: '0 0 10px rgba(231, 34, 129, 0.3)'
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 0.1, 
              ease: "easeOut" 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}