'use client';

import { useState } from 'react';
import { products } from '../../data/products';
import { getSimilarProducts, calculateSimilarityScore } from '../../data/similarity';
import ProductCard from '../../components/ProductCard';

export default function TestSimilarity() {
  const [selectedProductId, setSelectedProductId] = useState('1');
  
  const currentProduct = products.find(p => p.id === selectedProductId);
  const similarProducts = currentProduct ? getSimilarProducts(currentProduct, products, 3) : [];
  
  // Calculer les scores détaillés pour debug
  const detailedScores = currentProduct 
    ? products
        .filter(p => p.id !== currentProduct.id)
        .map(p => ({
          product: p,
          score: calculateSimilarityScore(currentProduct, p)
        }))
        .filter(s => s.score.score > 0)
        .sort((a, b) => b.score.score - a.score.score)
        .slice(0, 10)
    : [];

  if (!currentProduct) return <div>Produit non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Test Similarité Intelligente</h1>
      
      {/* Sélecteur de produit */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Choisir un produit:</label>
        <select 
          value={selectedProductId} 
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.category} - {product.subCategory}
            </option>
          ))}
        </select>
      </div>

      {/* Produit actuel */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Produit Actuel</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg">{currentProduct.name}</h3>
              <p className="text-gray-600">{currentProduct.category} • {currentProduct.subCategory}</p>
              <p className="text-gray-600">Ambiance: {currentProduct.ambiance}</p>
              <p className="text-gray-600">Prix: {currentProduct.price}€</p>
              {currentProduct.tags && (
                <p className="text-gray-600">Tags: {currentProduct.tags.join(', ')}</p>
              )}
              {currentProduct.badge && (
                <p className="text-gray-600">Badge: {currentProduct.badge}</p>
              )}
            </div>
            <div>
              <img 
                src={currentProduct.images[0].startsWith('http') ? currentProduct.images[0] : currentProduct.images[0].startsWith('/') ? currentProduct.images[0] : `/${currentProduct.images[0]}`}
                alt={currentProduct.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Produits Similaires (Intelligents)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarProducts.map(product => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                {calculateSimilarityScore(currentProduct, product).reasons.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debug - Scores détaillés */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Debug - Top 10 Scores</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Score</th>
                <th className="text-left p-2">Produit</th>
                <th className="text-left p-2">Catégorie</th>
                <th className="text-left p-2">Raisons</th>
              </tr>
            </thead>
            <tbody>
              {detailedScores.map(({ product, score }) => (
                <tr key={product.id} className="border-b">
                  <td className="p-2 font-bold">{score.score.toFixed(1)}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2 text-xs text-gray-600">{score.reasons.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
