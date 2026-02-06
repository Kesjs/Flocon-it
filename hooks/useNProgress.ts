"use client";

import NProgress from 'nprogress';
import { useCallback, useEffect } from 'react';

// Configuration optimisée de NProgress
NProgress.configure({
  minimum: 0.08,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  speed: 250,
  showSpinner: false,
  trickleSpeed: 150,
  trickle: true,
});

// Hook pour contrôler NProgress manuellement
export function useNProgress() {
  const start = useCallback(() => {
    NProgress.start();
  }, []);

  const done = useCallback(() => {
    NProgress.done();
  }, []);

  const configure = useCallback((options: any) => {
    NProgress.configure(options);
  }, []);

  // Auto-start sur les changements de route
  useEffect(() => {
    // Écouter les changements de route
    const handleStart = () => NProgress.start();
    const handleDone = () => NProgress.done();

    // Ajouter les écouteurs si on est dans le navigateur
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleStart);
      window.addEventListener('load', handleDone);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleStart);
        window.removeEventListener('load', handleDone);
      }
    };
  }, []);

  return { start, done, configure };
}
