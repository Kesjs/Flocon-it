"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products, getProductsByCategory } from "../data/products";

// Filtrer les produits par catégorie
const hiverProducts = getProductsByCategory('Hiver');
const valentinProducts = getProductsByCategory('Saint-Valentin');

function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  // Déterminer la couleur du bouton selon la catégorie
  const buttonColor = product.category === 'Saint-Valentin' ? 'bg-rose' : 'bg-textDark';
  
  // Calculer la promo si oldPrice existe
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Promo -{discount}%
          </div>
        )}
        {product.badge && (
          <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {product.badge}
          </div>
        )}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-lg mb-2 text-textDark">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviewsCount})</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-textDark">
              {product.price.toFixed(2)} €
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.oldPrice.toFixed(2)} €
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className={`${buttonColor} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 w-full justify-center mt-auto`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {product.category === 'Saint-Valentin' ? 'Offrir avec amour' : 'Prendre soin de moi'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const hiverProducts = getProductsByCategory('Hiver');
  const valentinProducts = getProductsByCategory('Saint-Valentin');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/white-rose-flower-red-tablecloth-blue.jpg"
            alt="Hero background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            Flocon
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            L'élégance rencontre la douceur pour créer des moments inoubliables
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#collection-hiver"
              className="bg-textDark text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors uppercase tracking-wide"
            >
              Explorer l'hiver
            </a>
            <a
              href="#collection-valentin"
              className="bg-rose text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors uppercase tracking-wide"
            >
              Saint-Valentin
            </a>
          </motion.div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          {/* Collection Hiver */}
          <div id="collection-hiver" className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold text-textDark mb-4 relative pb-3 inline-block">
                L'Art du Cocooning
                <motion.div 
                  className="absolute bottom-0 left-20 w-1/2 h-1 bg-rose"
                  initial={{ width: 0 }}
                  whileInView={{ width: "50%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Des textures qui vous enlacent quand le froid s'installe. Découvrez notre sélection de plaids et bougies pour un hiver douillet.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hiverProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Collection Saint-Valentin */}
          <div id="collection-valentin">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold text-textDark mb-4 relative pb-3 inline-block">
                Flocons de Tendresse
                <motion.div 
                  className="absolute bottom-0 left-20 w-1/2 h-1 bg-rose"
                  initial={{ width: 0 }}
                  whileInView={{ width: "50%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Déclarez votre flamme avec nos pépites de Saint-Valentin. Bijoux d'exception et expériences romantiques pour célébrer votre amour.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valentinProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-textDark mt-2 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les avis de nos clients satisfaits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Martin",
                location: "Paris",
                rating: 5,
                text: "Le plaid 'Nuage' est incroyablement doux ! Je m'enveloppe dedans chaque soir. La qualité est exceptionnelle et le design est magnifique. Un vrai cocon de douceur !",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
              },
              {
                name: "Thomas Dubois",
                location: "Lyon",
                rating: 5,
                text: "J'ai offert le bijou 'Flocon' à ma compagne pour la Saint-Valentin. Elle a adoré ! L'emballage était magnifique et le bijou est d'une beauté rare. Service impeccable !",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
              },
              {
                name: "Marie Leclerc",
                location: "Marseille",
                rating: 5,
                text: "La bougie 'Crépitement' crée une ambiance magique ! Le parfum bois de cèdre est subtil et apaisant. Parfait pour nos soirées cocooning. Je recommande vivement !",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-textDark">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
