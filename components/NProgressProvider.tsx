"use client";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/nprogress.css'; // Styles personnalisés
import { useEffect } from 'react';

// Configuration NProgress optimisée
NProgress.configure({
  minimum: 0.08,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  speed: 250,
  showSpinner: false,
  trickleSpeed: 150,
  trickle: true,
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
      setTimeout(stopProgress, 300); // Plus rapide pour plus de réactivité
      return originalPush.apply(window.history, args);
    };

    window.history.replaceState = function(...args) {
      startProgress();
      setTimeout(stopProgress, 300);
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
