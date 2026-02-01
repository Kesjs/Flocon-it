'use client';

// Cache des images préchargées
const imageCache = new Map();
const preloadQueue = new Set();

// Précharge une image en arrière-plan
function preloadImage(src) {
  if (imageCache.has(src) || preloadQueue.has(src)) {
    return Promise.resolve();
  }
  
  preloadQueue.add(src);
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, true);
      preloadQueue.delete(src);
      resolve();
    };
    img.onerror = () => {
      preloadQueue.delete(src);
      // Silently fail instead of rejecting to avoid console errors
      console.warn(`Failed to preload image: ${src}`);
      resolve(); // Resolve instead of reject to prevent unhandled promise rejections
    };
    img.src = src;
  });
}

// Précharge plusieurs images avec priorité
function preloadImages(srcs, priority = 'low') {
  if (priority === 'high') {
    // Images prioritaires : charger immédiatement
    return Promise.all(srcs.map(src => preloadImage(src)));
  } else {
    // Images non prioritaires : charger quand le navigateur est inactif
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        srcs.forEach(src => preloadImage(src));
      });
    } else {
      // Fallback : charger avec un petit délai
      setTimeout(() => {
        srcs.forEach(src => preloadImage(src));
      }, 100);
    }
  }
}

export default function imageLoader({ src, width, quality }) {
  // Si c'est déjà une URL externe, retourner l'original avec les paramètres
  if (src.startsWith('http')) {
    // List of domains that don't support query parameters well
    const problematicDomains = ['boutique-rose-eternelle.com', 'made-in-china.com', 'amazon.com'];
    
    // Check if the source is from a problematic domain
    const isProblematic = problematicDomains.some(domain => src.includes(domain));
    
    // If it's a problematic domain or already has complex query params, return as-is
    if (isProblematic || src.includes('?') && src.includes('=')) {
      // Still try to preload the original URL
      if (!imageCache.has(src)) {
        preloadImage(src);
      }
      return src;
    }
    
    // For other external URLs, safely add parameters
    const separator = src.includes('?') ? '&' : '?';
    const finalSrc = `${src}${separator}w=${width}&q=${quality || 75}`;
    
    // Précharger l'image si elle n'est pas encore en cache
    if (!imageCache.has(src)) {
      preloadImage(finalSrc);
    }
    
    return finalSrc;
  }
  
  // Pour les images locales, utiliser le chemin relatif
  const finalSrc = `/${src}?w=${width}&q=${quality || 75}`;
  
  // Précharger l'image locale
  if (!imageCache.has(finalSrc)) {
    preloadImage(finalSrc);
  }
  
  return finalSrc;
}

// Exporter les fonctions de préchargement pour utilisation dans les composants
export { preloadImages, preloadImage };
