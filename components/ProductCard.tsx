"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";
import OptimizedImage from "./OptimizedImage";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
  };

  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden will-change-transform flex flex-col ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Promo -{discount}%
          </span>
        )}
        {product.badge && !product.oldPrice && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            product.badge === 'Best-seller' ? 'bg-green-100 text-green-800' :
            product.badge === 'Nouveauté' ? 'bg-blue-100 text-blue-800' :
            product.badge === 'Cadeau parfait' ? 'bg-pink-100 text-pink-800' :
            product.badge === 'Édition limitée' ? 'bg-purple-100 text-purple-800' :
            'bg-rose-custom-100 text-rose-custom-800'
          }`}>
            {product.badge}
          </span>
        )}
      </div>


      {/* Product Image - Version optimisée */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <Link href={`/boutique/${product.slug}`} className="block w-full h-full">
          <OptimizedImage
            src={product.images[0].startsWith('http') ? product.images[0] : 
                 (product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`)}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={75}
            loading="lazy"
            fallbackSrc="/placeholder-product.webp"
            onError={() => setImageError(true)}
          />
        </Link>
        {/* Quick add to cart on hover - Desktop only */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto">
          <button
            onClick={handleAddToCart}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2 transform translate-y-4 lg:group-hover:translate-y-0 lg:transition-transform lg:duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden lg:inline">Ajouter au panier</span>
            <span className="lg:hidden">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 pt-6 flex flex-col flex-grow">
        <div className="mb-2">
          <Link href={`/boutique/${product.slug}`} className="block">
            <h3 className="font-semibold text-textDark hover:text-rose-custom transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{product.subCategory}</p>
        </div>

        {/* Description simplifiée */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-1">
            {product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
          </p>
          <Link href={`/boutique/${product.slug}`} className="text-xs text-rose-custom hover:text-rose-custom/80 font-medium mt-1 transition-colors flex items-center gap-1">
            Voir plus 
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-lg font-bold text-textDark">
            {product.price.toFixed(2)} €
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.oldPrice.toFixed(2)} €
            </span>
          )}
        </div>

        {/* Mobile Add to Cart Button - Always visible on mobile */}
        <div className="lg:hidden mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full bg-rose-custom text-white px-4 py-3 rounded-lg font-medium hover:bg-rose-custom/90 transition-colors flex items-center justify-center space-x-2 min-h-[44px]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { ProductCard };
