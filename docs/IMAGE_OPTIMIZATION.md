# Optimisation des Images

Ce document explique comment optimiser les images dans l'application pour des performances optimales.

## Composants d'Image

### ImageOptimizer (Recommandé)

Le composant `ImageOptimizer` est une surcouche optimisée du composant `next/image` avec des fonctionnalités supplémentaires :

```tsx
import ImageOptimizer from '@/components/ImageOptimizer';

<ImageOptimizer
  src="/path/to/image.jpg"
  alt="Description de l'image"
  width={800}
  height={600}
  quality={80}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  objectFit="cover"
  rounded="lg"
  aspectRatio="16/9"
  className="custom-class"
/>
```

### OptimizedImage (Utilisation avancée)

Pour des cas d'utilisation plus avancés, vous pouvez utiliser directement le composant `OptimizedImage` :

```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  quality={80}
  loading="lazy"
  fallbackSrc="/fallback.jpg"
  onError={(e) => console.error('Erreur de chargement', e)}
/>
```

## Bonnes Pratiques

1. **Toujours spécifier la largeur et la hauteur** pour éviter les décalages de mise en page (CLS).
2. **Utiliser des tailles adaptatives** avec la propriété `sizes` pour le chargement progressif.
3. **Activer le chargement paresseux** avec `loading="lazy"` pour les images hors écran.
4. **Utiliser des placeholders** pour une meilleure expérience utilisateur.
5. **Optimiser la qualité** (70-80% est généralement suffisant).

## Configuration Next.js

La configuration des images est définie dans `next.config.js` :

- Formats supportés : WebP et AVIF
- Tailles d'appareils prédéfinies
- Mise en cache de 7 jours
- Domaines distants autorisés configurés

## Outils Recommandés

- [Squoosh](https://squoosh.app/) pour l'optimisation des images
- [BlurHash](https://blurha.sh/) pour les placeholders flous
- [Sharp](https://sharp.pixelplumbing.com/) pour le traitement d'images côté serveur

## Dépannage

### Les images ne se chargent pas
- Vérifiez que le domaine est autorisé dans `next.config.js`
- Assurez-vous que le chemin de l'image est correct
- Vérifiez les erreurs dans la console du navigateur

### Problèmes de performance
- Réduisez la qualité des images
- Utilisez des images de taille appropriée
- Activez la compression GZIP/Brotli sur votre serveur
