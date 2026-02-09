"use client";

import { getProductsBySubCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function AmbianceBougiesPage() {
  const products = getProductsBySubCategory('Ambiance & Bougies');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-textDark mb-4">Ambiance & Bougies</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Créez une atmosphère chaleureuse et apaisante avec nos bougies artisanales. 
              Des parfums envoûtants qui évoquent le confort et la douceur d'un foyer accueillant.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
