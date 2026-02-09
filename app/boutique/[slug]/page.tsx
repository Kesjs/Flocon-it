"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getProductsByCategory, Product, products } from "../../../data/products";
import { getSimilarProducts } from "../../../data/similarity";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingCart, Heart, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = getSimilarProducts(product, products, 3);

  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-textDark transition-colors">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/boutique" className="text-gray-500 hover:text-textDark transition-colors">
              Boutique
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/boutique?category=${product.category}`} className="text-gray-500 hover:text-textDark transition-colors">
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-textDark font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden">
              <img
                src={product.images[selectedImageIndex].startsWith('http') ? product.images[selectedImageIndex] : product.images[selectedImageIndex].startsWith('/') ? product.images[selectedImageIndex] : `/${product.images[selectedImageIndex]}`}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                  -{discount}%
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-rose text-rose-custom' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-rose-custom' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.startsWith('http') ? image : image.startsWith('/') ? image : `/${image}`}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm text-gray-500">{product.subCategory}</span>
                {product.badge && (
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
              
              <h1 className="text-3xl font-bold text-textDark mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-textDark font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviewsCount} avis)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-textDark">
                  {product.price.toFixed(2)} €
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {product.oldPrice.toFixed(2)} €
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded">
                      Économisez {(product.oldPrice - product.price).toFixed(2)} €
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Info */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                product.stock > 10 ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm text-gray-600">
                {product.stock > 10 ? 'En stock' : `Plus que ${product.stock} articles`}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-textDark">Quantité:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2" style={{ backgroundColor: 'var(--rose)' }}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-rose-custom" />
                <div>
                  <div className="font-medium text-textDark">Livraison offerte</div>
                  <div className="text-sm text-gray-600">Dès 50€ d'achat</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-rose-custom" />
                <div>
                  <div className="font-medium text-textDark">Garantie 30 jours</div>
                  <div className="text-sm text-gray-600">Satisfait ou remboursé</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-rose-custom" />
                <div>
                  <div className="font-medium text-textDark">Retour facile</div>
                  <div className="text-sm text-gray-600">Sans questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-textDark mb-6">Description détaillée</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-textDark mb-4">Caractéristiques principales</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Qualité premium et fabrication artisanale</li>
                  <li>• Design élégant et moderne</li>
                  <li>• Matériaux durables et respectueux de l'environnement</li>
                  <li>• Emballage cadeau inclus</li>
                  <li>• Certifié par nos experts</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-textDark mb-4 mt-6">Entretien</h3>
                <p className="text-gray-700">
                  Pour préserver la beauté de votre produit, nous recommandons un entretien délicat 
                  et de suivre les instructions fournies. Nettoyer avec un chiffon doux et éviter 
                  l'exposition prolongée à l'humidité.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-textDark mb-6">Informations</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Catégorie</dt>
                  <dd className="text-textDark">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sous-catégorie</dt>
                  <dd className="text-textDark">{product.subCategory}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ambiance</dt>
                  <dd className="text-textDark">{product.ambiance}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Référence</dt>
                  <dd className="text-textDark">FL-{product.id.toString().padStart(4, '0')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-textDark mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="h-full">
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
