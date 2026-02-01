'use client';

import { useState, useEffect } from 'react';
import { products } from '../../data/products';
import { preloadImages, preloadImage } from '../../image-loader';

export default function TestPreloading() {
  const [cacheStatus, setCacheStatus] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  // Rafraîchir le statut du cache
  const refreshCacheStatus = () => {
    // Simuler la vérification du cache (dans un vrai cas, on exposerait cette info)
    const testImages = products.slice(0, 10).flatMap(p => p.images.slice(0, 1));
    const status = new Map();
    
    testImages.forEach(src => {
      // Simuler une vérification de cache
      status.set(src, Math.random() > 0.5 ? 'cached' : 'not-cached');
    });
    
    setCacheStatus(status);
  };

  useEffect(() => {
    refreshCacheStatus();
    const interval = setInterval(refreshCacheStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['Toutes', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'Toutes' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handlePreloadCategory = async () => {
    setLoading(true);
    const categoryImages = filteredProducts.slice(0, 20).flatMap(p => p.images.slice(0, 1));
    
    try {
      await preloadImages(categoryImages, 'high');
      refreshCacheStatus();
    } catch (error) {
      console.error('Erreur de préchargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreloadSingle = async (imageSrc: string) => {
    try {
      await preloadImage(imageSrc);
      refreshCacheStatus();
    } catch (error) {
      console.error('Erreur de préchargement:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Test Préchargement d'Images</h1>
      
      {/* Contrôles */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handlePreloadCategory}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Préchargement...' : `Précharger ${selectedCategory}`}
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-2">Produits filtrés</h3>
          <p className="text-3xl font-bold text-blue-500">{filteredProducts.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-2">Images à précharger</h3>
          <p className="text-3xl font-bold text-green-500">
            {filteredProducts.slice(0, 20).flatMap(p => p.images.slice(0, 1)).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-2">Cache Status</h3>
          <p className="text-3xl font-bold text-purple-500">
            {Array.from(cacheStatus.values()).filter(s => s === 'cached').length}/{cacheStatus.size}
          </p>
        </div>
      </div>

      {/* Images test */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Images Test</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, 12).map(product => (
            <div key={product.id} className="relative group">
              <img
                src={product.images[0].startsWith('http') ? product.images[0] : product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`}
                alt={product.name}
                className="w-full h-24 object-cover rounded-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                <button
                  onClick={() => handlePreloadSingle(product.images[0])}
                  className="opacity-0 group-hover:opacity-100 bg-white text-black px-2 py-1 rounded text-xs"
                >
                  Précharger
                </button>
              </div>
              <div className="mt-1">
                <p className="text-xs font-medium truncate">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {cacheStatus.get(product.images[0]) === 'cached' ? '✅' : '⏳'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2">💡 Comment ça marche :</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Les images du produit actuel sont préchargées avec priorité haute</li>
          <li>• Les produits similaires sont préchargés en arrière-plan (priorité basse)</li>
          <li>• Le cache évite les rechargements multiples</li>
          <li>• requestIdleCallback est utilisé pour ne pas impacter les performances</li>
        </ul>
      </div>
    </div>
  );
}
