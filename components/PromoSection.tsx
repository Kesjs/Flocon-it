"use client";

import { motion } from "framer-motion";
import { Star, Heart, ArrowRight } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "@/components/ProductCard";

export default function PromoSection() {
  // Filtrer les produits en promotion et trier par pourcentage de réduction
  const coupsDeCoeur = products
    .filter(product => product.oldPrice && product.oldPrice > product.price)
    .map(product => ({
      ...product,
      discountPercentage: Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    }))
    .sort((a, b) => b.discountPercentage - a.discountPercentage) // Meilleures réductions en premier
    .slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-br from-rose-custom/5 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-rose-custom/10 rounded-full mb-4">
            <span className="text-rose-custom font-medium text-sm">Offre Spéciale</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-textDark mb-4">
            Nos Coups de Cœur du Moment
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Découvrez nos créations favorites, sélectionnées avec amour pour illuminer vos plus beaux moments.
          </p>
        </motion.div>

        {/* Produits en ligne horizontale */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {coupsDeCoeur.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Bouton CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="/boutique/promotions"
            className="inline-flex items-center px-8 py-3 bg-rose-custom text-white font-bold rounded-lg hover:bg-rose-700 transition-all duration-300 shadow-xl text-lg"
          >
            Voir toute la collection
            <ArrowRight className="w-6 h-6 ml-3" />
          </a>
        </motion.div>

        {/* Badge de confiance */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-rose-custom text-rose-custom" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.8/5 sur 2000+ avis</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-custom" />
            <span className="text-gray-700 font-medium">Satisfaction garantie</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ArrowRight className="w-4 h-4 text-rose-custom" />
            <span className="text-gray-700 font-medium">Livraison 48h</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
