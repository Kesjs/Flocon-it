import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
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
}

export default function OptimizedImage({
  src,
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
}: OptimizedImageProps) {
  const imageProps = {
    src,
    alt,
    className,
    priority,
    quality,
    sizes,
    style,
    onError,
  };

  if (fill) {
    return (
      <div className={`relative ${className}`} style={style}>
        <Image
          {...imageProps}
          fill
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        />
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
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
