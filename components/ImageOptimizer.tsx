'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import { StaticImageData } from 'next/image';

export interface ImageOptimizerProps {
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
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  aspectRatio?: '1/1' | '4/3' | '3/2' | '16/9' | '21/9' | '9/16' | '1/2' | '2/3';
  onLoad?: () => void;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 80,
  sizes,
  style = {},
  onError,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy',
  unoptimized = false,
  fallbackSrc = '/placeholder-product.jpg',
  objectFit = 'cover',
  objectPosition = 'center',
  rounded = 'none',
  aspectRatio,
  onLoad,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Gestion du chargement de l'image
  const handleLoad = () => {
    setIsImageLoaded(true);
    if (onLoad) onLoad();
  };

  // Gestion des erreurs de chargement
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onError) {
      onError(e);
    }
  };

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Classes pour les coins arrondis
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  // Classes pour le ratio d'aspect
  const aspectRatioClasses = {
    '1/1': 'aspect-square',
    '4/3': 'aspect-4/3',
    '3/2': 'aspect-3/2',
    '16/9': 'aspect-video',
    '21/9': 'aspect-[21/9]',
    '9/16': 'aspect-[9/16]',
    '1/2': 'aspect-[1/2]',
    '2/3': 'aspect-[2/3]',
  };

  // Si le composant n'est pas encore monté côté client, afficher un placeholder
  if (!isMounted) {
    return (
      <div 
        className={`bg-gray-100 ${aspectRatio ? aspectRatioClasses[aspectRatio] : ''} ${roundedClasses[rounded]} ${className}`}
        style={{
          ...style,
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
        }}
      />
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${aspectRatio ? aspectRatioClasses[aspectRatio] : ''} ${roundedClasses[rounded]} ${className}`}
      style={{
        ...style,
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          objectFit,
          objectPosition,
          ...style,
        }}
        priority={priority}
        quality={quality}
        sizes={sizes}
        onError={handleError}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
        unoptimized={unoptimized}
        fallbackSrc={fallbackSrc}
      />
      
      {/* Placeholder de chargement */}
      {!isImageLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
};

export default ImageOptimizer;
