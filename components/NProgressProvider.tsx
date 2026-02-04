"use client";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/nprogress.css'; // Styles personnalisés
import { useEffect } from 'react';

// Configuration NProgress
NProgress.configure({
  minimum: 0.1,
  easing: 'ease',
  speed: 300,
  showSpinner: false,
  trickleSpeed: 200,
});

interface NProgressProviderProps {
  children: React.ReactNode;
}

export default function NProgressProvider({ children }: NProgressProviderProps) {
  useEffect(() => {
    // Démarrer NProgress au début de la navigation
    const startProgress = () => {
      NProgress.start();
    };

    // Arrêter NProgress à la fin de la navigation
    const stopProgress = () => {
      NProgress.done();
    };

    // Écouter les événements de navigation Next.js
    const handleRouteChangeStart = (url: string) => {
      if (url !== window.location.pathname) {
        startProgress();
      }
    };

    const handleRouteChangeComplete = () => {
      stopProgress();
    };

    const handleRouteChangeError = () => {
      stopProgress();
    };

    // S'abonner aux événements
    window.addEventListener('beforeunload', startProgress);
    
    // Pour Next.js App Router, on utilise les événements personnalisés
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function(...args) {
      startProgress();
      setTimeout(stopProgress, 500); // Arrêter après un court délai
      return originalPush.apply(window.history, args);
    };

    window.history.replaceState = function(...args) {
      startProgress();
      setTimeout(stopProgress, 500);
      return originalReplace.apply(window.history, args);
    };

    // Nettoyage
    return () => {
      window.removeEventListener('beforeunload', startProgress);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      NProgress.done();
    };
  }, []);

  return <>{children}</>;
}
