'use client';

import ProductCard from './ProductCard';
import { DisplayedProduct } from '@/hooks/useProductDisplay';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: DisplayedProduct[];
  layout?: 'grid' | 'carousel';
  columns?: number;
  className?: string;
}

export const ProductSection = ({ 
  title, 
  subtitle, 
  products, 
  layout = 'grid', 
  columns = 4,
  className = '' 
}: ProductSectionProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  const getGridCols = (cols: number) => {
    const gridColsMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2 md:grid-cols-2',
      3: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
    };
    return gridColsMap[cols] || gridColsMap[4];
  };

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {layout === 'grid' ? (
          <div className={`grid ${getGridCols(columns)} gap-6`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
              {products.map((product) => (
                <div key={product.id} className="flex-none w-72">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show more indicator for carousel */}
        {layout === 'carousel' && products.length > 3 && (
          <div className="flex justify-center mt-6">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Voir plus →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
