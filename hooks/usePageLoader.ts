"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => {
      // Délai minimum réduit pour voir l'animation mais plus rapide
      setTimeout(() => setIsLoading(false), 200);
    };

    // Détecter le chargement initial de la page
    const handlePageLoad = () => {
      handleStart();
      setTimeout(() => {
        handleComplete();
      }, 800); // Durée plus longue pour voir le loader au chargement
    };

    // Si la page vient de se charger, afficher le loader
    if (document.readyState === 'complete') {
      // Page déjà chargée, ne rien faire
    } else {
      // Page en cours de chargement
      handlePageLoad();
      window.addEventListener('load', handleComplete);
    }

    // Écouter les événements de route
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (url: string) => {
      handleStart();
      setTimeout(() => {
        originalPush(url);
        handleComplete();
      }, 100);
      return Promise.resolve(true);
    };

    router.replace = (url: string) => {
      handleStart();
      setTimeout(() => {
        originalReplace(url);
        handleComplete();
      }, 100);
      return Promise.resolve(true);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      window.removeEventListener('load', handleComplete);
    };
  }, [router]);

  return { isLoading };
}
