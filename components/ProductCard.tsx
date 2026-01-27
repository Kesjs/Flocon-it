"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "../data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      {/* Wishlist button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
      >
        <Heart 
          className={`w-4 h-4 ${
            isWishlisted ? 'fill-rose text-rose-custom' : 'text-gray-600'
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 pt-8">
        <Link href={`/boutique/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </Link>
        
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            -{discount}%
          </div>
        )}

        {/* Quick add to cart on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleAddToCart}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Ajouter au panier</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 pt-6">
        <div className="mb-2">
          <Link href={`/boutique/${product.slug}`} className="block">
            <h3 className="font-semibold text-textDark hover:text-rose-custom transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{product.subCategory}</p>
        </div>

        {/* Description */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <Link href={`/boutique/${product.slug}`} className="text-xs text-rose-custom hover:text-rose-custom/80 font-medium mt-1 transition-colors inline-block">
            Voir plus →
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
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-textDark">
            {product.price.toFixed(2)} €
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.oldPrice.toFixed(2)} €
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
