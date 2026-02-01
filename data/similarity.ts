import { Product } from './products';

export interface SimilarityScore {
  product: Product;
  score: number;
  reasons: string[];
}

/**
 * Calcule un score de similarité entre deux produits
 * Basé sur plusieurs critères avec poids différents
 */
export function calculateSimilarityScore(
  currentProduct: Product,
  candidateProduct: Product
): SimilarityScore {
  const score: SimilarityScore = {
    product: candidateProduct,
    score: 0,
    reasons: []
  };

  // Éviter de comparer le produit avec lui-même
  if (currentProduct.id === candidateProduct.id) {
    return score;
  }

  // 1. Même sous-catégorie (score: 40 points)
  if (currentProduct.subCategory === candidateProduct.subCategory) {
    score.score += 40;
    score.reasons.push('Même sous-catégorie');
  }

  // 2. Tags communs (score: 25 points max)
  if (currentProduct.tags && candidateProduct.tags) {
    const commonTags = currentProduct.tags.filter(tag => 
      candidateProduct.tags?.includes(tag)
    );
    if (commonTags.length > 0) {
      score.score += Math.min(commonTags.length * 8, 25);
      score.reasons.push(`Tags communs: ${commonTags.join(', ')}`);
    }
  }

  // 3. Même ambiance (score: 20 points)
  if (currentProduct.ambiance === candidateProduct.ambiance) {
    score.score += 20;
    score.reasons.push('Même ambiance');
  }

  // 4. Gamme de prix similaire ±30% (score: 10 points)
  const priceDiff = Math.abs(currentProduct.price - candidateProduct.price);
  const priceThreshold = currentProduct.price * 0.3;
  if (priceDiff <= priceThreshold) {
    score.score += 10;
    score.reasons.push('Gamme de prix similaire');
  }

  // 5. Même catégorie uniquement (score: 5 points)
  if (currentProduct.category === candidateProduct.category) {
    score.score += 5;
    score.reasons.push('Même catégorie');
  }

  // Bonus : Badge similaire (score: 5 points)
  if (currentProduct.badge && currentProduct.badge === candidateProduct.badge) {
    score.score += 5;
    score.reasons.push('Même badge');
  }

  return score;
}

/**
 * Retourne les produits les plus similaires au produit actuel
 * Avec une part de hasard pour éviter toujours les mêmes résultats
 */
export function getSimilarProducts(
  currentProduct: Product,
  allProducts: Product[],
  maxResults: number = 3,
  randomFactor: number = 0.2 // 20% de hasard
): Product[] {
  // Calculer les scores de similarité pour tous les autres produits
  const scores: SimilarityScore[] = allProducts
    .filter(p => p.id !== currentProduct.id)
    .map(product => calculateSimilarityScore(currentProduct, product))
    .filter(score => score.score > 0); // Garder seulement les produits avec une similarité

  // Si aucun produit similaire, retourner des produits aléatoires de la même catégorie
  if (scores.length === 0) {
    const sameCategoryProducts = allProducts.filter(
      p => p.category === currentProduct.category && p.id !== currentProduct.id
    );
    return shuffleArray(sameCategoryProducts).slice(0, maxResults);
  }

  // Ajouter un facteur aléatoire pour varier les résultats
  scores.forEach(score => {
    const randomBonus = Math.random() * randomFactor * 100; // Jusqu'à 20% de score bonus
    score.score += randomBonus;
  });

  // Trier par score décroissant et prendre les meilleurs
  scores.sort((a, b) => b.score - a.score);

  // Mélanger légèrement les résultats parmi les meilleurs scores
  const topScores = scores.slice(0, Math.min(maxResults * 2, scores.length));
  const shuffled = shuffleArray(topScores);

  return shuffled.slice(0, maxResults).map(s => s.product);
}

/**
 * Fonction utilitaire pour mélanger un tableau (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Retourne une description textuelle des raisons de similarité
 */
export function getSimilarityReasons(score: SimilarityScore): string {
  if (score.reasons.length === 0) {
    return 'Produit recommandé';
  }
  
  const mainReasons = score.reasons.slice(0, 2); // Top 2 raisons
  if (mainReasons.length === 1) {
    return mainReasons[0];
  }
  
  return `${mainReasons[0]} • ${mainReasons[1]}`;
}
