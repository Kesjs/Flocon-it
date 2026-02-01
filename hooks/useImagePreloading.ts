import { useEffect } from 'react';
import { Product } from '../data/products';
import { preloadImages } from '../image-loader';

/**
 * Hook pour précharger les images des produits visibles et proches
 */
export function useProductImagePreloading(
  products: Product[],
  visibleCount: number = 8,
  preloadCount: number = 12
) {
  useEffect(() => {
    if (!products.length) return;

    // Images des produits visibles (priorité haute)
    const visibleProducts = products.slice(0, visibleCount);
    const visibleImages = visibleProducts.flatMap(p => p.images);
    
    // Images des produits supplémentaires (priorité basse)
    const additionalProducts = products.slice(visibleCount, visibleCount + preloadCount);
    const additionalImages = additionalProducts.flatMap(p => p.images);

    // Précharger les images visibles immédiatement
    if (visibleImages.length > 0) {
      preloadImages(visibleImages, 'high');
    }

    // Précharger les images supplémentaires en arrière-plan
    if (additionalImages.length > 0) {
      preloadImages(additionalImages, 'low');
    }
  }, [products, visibleCount, preloadCount]);
}

/**
 * Hook pour précharger les images d'une catégorie spécifique
 */
export function useCategoryPreloading(category: string, allProducts: Product[]) {
  useEffect(() => {
    const categoryProducts = allProducts.filter(p => p.category === category);
    const categoryImages = categoryProducts.slice(0, 20).flatMap(p => p.images);
    
    if (categoryImages.length > 0) {
      // Précharger en arrière-plan avec priorité basse
      preloadImages(categoryImages, 'low');
    }
  }, [category, allProducts]);
}

/**
 * Hook pour précharger les images de recherche
 */
export function useSearchPreloading(searchResults: Product[]) {
  useEffect(() => {
    if (searchResults.length > 0) {
      // Précharger toutes les images de recherche avec priorité moyenne
      const searchImages = searchResults.flatMap(p => p.images);
      preloadImages(searchImages, 'medium');
    }
  }, [searchResults]);
}
