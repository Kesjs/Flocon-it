import Image, { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';
import ImagePlaceholder from './ImagePlaceholder';

interface OptimizedImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  style?: React.CSSProperties;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'eager' | 'lazy';
  unoptimized?: boolean;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src: originalSrc,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  sizes,
  style,
  onError,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy',
  unoptimized = false,
  fallbackSrc = '/placeholder.webp',
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(originalSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Éviter les erreurs d'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gestion des erreurs de chargement - SANS FALLBACK
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`⚠️ OptimizedImage - Failed to load:`, originalSrc);
    
    if (onError) {
      onError(e);
    }
    
    // ❌ PLUS DE FALLBACK - On laisse l'image échouer naturellement
    if (!hasError) {
      setHasError(true);
    }
  };

  // Réinitialiser l'état lors du changement de source
  useEffect(() => {
    setImgSrc(originalSrc);
    setHasError(false);
    setIsLoading(true);
  }, [originalSrc]);

  // Précharger l'image quand le composant est monté
  useEffect(() => {
    if (isMounted && originalSrc && !hasError) {
      // L'image sera chargée par le composant Image de Next.js
      // Pas besoin de préchargement manuel
      setIsLoading(false);
    }
  }, [isMounted, originalSrc, hasError]);

  // Tailles par défaut plus précises
  const defaultSizes = fill 
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined;

  // Propriétés communes de l'image
  const imageProps = {
    src: imgSrc,
    alt,
    className: `${className || ''} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`.trim(),
    priority,
    quality,
    sizes: sizes || defaultSizes,
    style: { ...style },
    onError: handleError,
    onLoad: () => setIsLoading(false), // Correction: utiliser onLoad au lieu de onLoadingComplete
    placeholder,
    blurDataURL,
    loading,
    unoptimized,
  };

  // Toujours rendre la même structure côté serveur et client
  if (fill) {
    return (
      <div className={`relative w-full h-full ${className || ''}`} style={style}>
        {/* Placeholder toujours rendu pour éviter l'hydratation mismatch */}
        <div 
          className={`absolute inset-0 bg-gray-100 transition-opacity duration-300 ${
            isMounted && !isLoading && !hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`} 
        />
        <Image
          {...imageProps}
          fill
          sizes={sizes || defaultSizes}
          key={`${isMounted}-${imgSrc}`}
        />
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {/* Placeholder toujours rendu pour éviter l'hydratation mismatch */}
      <div 
        className={`absolute inset-0 bg-gray-100 transition-opacity duration-300 ${
          isMounted && !isLoading && !hasError ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`} 
      />
      <Image
        {...imageProps}
        width={width}
        height={height}
        key={`${isMounted}-${imgSrc}`}
      />
    </div>
  );
}

// Hook pour générer des srcsets optimisés
export function useOptimizedSrcSet(src: string, sizes: number[]) {
  // Générer les chemins pour les formats modernes
  const getModernFormats = (originalSrc: string) => {
    // Si c'est déjà une URL externe, retourner l'original
    if (originalSrc.startsWith('http')) {
      return { webp: originalSrc, avif: originalSrc, fallback: originalSrc };
    }

    // Pour les images locales, essayer les formats modernes
    const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    const webpSrc = `${baseSrc}.webp`;
    const avifSrc = `${baseSrc}.avif`;

    return {
      webp: webpSrc,
      avif: avifSrc,
      fallback: originalSrc
    };
  };
  
  const formats = getModernFormats(src);
  
  const generateSrcSet = (baseSrc: string) => {
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  };

  return {
    srcSet: generateSrcSet(formats.fallback),
    webpSrcSet: generateSrcSet(formats.webp),
    avifSrcSet: generateSrcSet(formats.avif)
  };
}
