"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, Tag, TrendingUp, Star, ShoppingCart, Sparkles, Truck, RotateCcw, Gift } from "lucide-react";
import ChatbotModal from "@/components/ChatbotModal";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  // Filtrer les produits en promotion
  const promoProducts = products.filter(product => 
    product.oldPrice && product.oldPrice > product.price
  );

  const filteredProducts = promoProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les statistiques
  const totalSavings = promoProducts.reduce((acc, product) => {
    const discount = product.oldPrice ? product.oldPrice - product.price : 0;
    return acc + discount;
  }, 0);

  const averageDiscount = promoProducts.length > 0 
    ? Math.round(promoProducts.reduce((acc, product) => {
        const discount = product.oldPrice ? ((product.oldPrice - product.price) / product.oldPrice) * 100 : 0;
        return acc + discount;
      }, 0) / promoProducts.length)
    : 0;

  return (
    <div className="pt-28 min-h-screen bg-gray-50">
      {/* Hero Section Promotions */}
      <section className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 py-20 lg:py-32 overflow-hidden">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-300 rounded-full opacity-15 animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu Gauche */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                   OFFRES LIMITÉES - JUSQU'À -70%
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-display font-black text-textDark mb-6 leading-tight">
                Des
                <span className="text-orange-600"> Incroyables</span>
                <br />
                Promotions
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Profitez de réductions exceptionnelles sur des centaines de cadeaux uniques. 
                Les meilleures offres du moment, disponibles pour une durée limitée !
              </p>
              
              {/* Compteurs animés */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-3xl font-black text-orange-600">{promoProducts.length}</div>
                  <div className="text-sm text-gray-600">Produits en promo</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-3xl font-black text-orange-600">{averageDiscount}%</div>
                  <div className="text-sm text-gray-600">Réduction moyenne</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-md">
                  <div className="text-3xl font-black text-orange-600">{totalSavings.toFixed(0)}€</div>
                  <div className="text-sm text-gray-600">Économies totales</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#produits-promo"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg font-black hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Voir les Promos
                </Link>
                <button className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300">
                  Compte à Rebours
                </button>
              </div>
            </motion.div>

            {/* Contenu Droit - Image Réelle */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-square relative">
                  <Image
                    src="https://img.freepik.com/photos-gratuite/femme-insouciante-indifferente-hausse-epaules-se-sent-hesitante-ennuye-expression-indifferente-utilise-telephone-portable-pour-discuter-ligne-vetue-t-shirt-base-decontracte-isole-fond-rose_273609-62605.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="Femme surprise par une promotion incroyable"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay léger */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {/* Badge promo par-dessus l'image */}
                  <div className="absolute top-6 right-6">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                      -70% OFFRE FLASH
                    </div>
                  </div>
                  
                  {/* Texte par-dessus l'image */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-2">Surprises Incroyables</h3>
                      <p className="text-sm opacity-90">Des promotions qui vous laisseront sans voix</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chatbot Logo - Desktop */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={() => setIsChatbotOpen(true)}
          className="hidden md:flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative w-20 h-20 rounded-full border-4 border-white/20 p-1 bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
             <img
              src="https://img.freepik.com/vecteurs-premium/pet-love-logo-coeur-symbole-chat-au-design-plat-couleur-rose_8586-1132.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Chatbot Flocon"
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </motion.div>

        {/* Bouton flottant chatbot MOBILE */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatbotOpen(true)}
          className="md:hidden fixed bottom-8 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-30 overflow-hidden"
          style={{ backgroundColor: 'var(--rose)' }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img
              src="https://img.freepik.com/vecteurs-premium/pet-love-logo-coeur-symbole-chat-au-design-plat-couleur-rose_8586-1132.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Chatbot Flocon"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.button>
      </section>

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      {/* Barre de recherche flottante */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-4xl mx-auto px-4 -mt-10 relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-rose-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Cherchez votre promo... Ex: mug, bijou, moins de 20€"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-custom focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Filtres rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Meilleures réductions", filter: "best" },
              { label: "Moins de 20€", filter: "under20" },
              { label: "Saint-Valentin", filter: "valentin" },
              { label: "Nouveautés", filter: "new" }
            ].map((filter, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white border border-rose-300 rounded-full hover:bg-rose-custom hover:text-white transition-colors"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Compte à rebours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 bg-rose-50 border-2 border-rose-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-center gap-2 text-rose-800 mb-3">
            <Clock className="w-5 h-5" />
            <h3 className="font-bold text-xl">OFFRES LIMITÉES - TERMINE DANS :</h3>
          </div>
          <div className="flex justify-center gap-4 text-center">
            <div className="bg-rose-custom text-white rounded-lg p-4 min-w-[80px]">
              <div className="text-2xl font-black">23</div>
              <div className="text-xs">HEURES</div>
            </div>
            <div className="bg-rose-custom text-white rounded-lg p-4 min-w-[80px]">
              <div className="text-2xl font-black">45</div>
              <div className="text-xs">MINUTES</div>
            </div>
            <div className="bg-rose-custom text-white rounded-lg p-4 min-w-[80px]">
              <div className="text-2xl font-black">12</div>
              <div className="text-xs">SECONDES</div>
            </div>
          </div>
        </motion.div>

        {/* Produits en promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="produits-promo"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-textDark">
              {filteredProducts.length} promotions explosives 🔥
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              Trié par : meilleures réductions
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts
                .sort((a, b) => {
                  const discountA = a.oldPrice ? ((a.oldPrice - a.price) / a.oldPrice) * 100 : 0;
                  const discountB = b.oldPrice ? ((b.oldPrice - b.price) / b.oldPrice) * 100 : 0;
                  return discountB - discountA;
                })
                .map((product, index) => {
                  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="relative"
                    >
                      {/* Badge de réduction */}
                      <div className="absolute -top-2 -right-2 z-20 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-lg">
                        -{discount}%
                      </div>
                      <ProductCard product={product} />
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucune promotion trouvée pour "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="text-rose-custom hover:underline"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </motion.div>

        {/* Section avantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Truck,
              title: "Livraison offerte",
              description: "Pour toute commande supérieure à 50€ en promotion"
            },
            {
              icon: RotateCcw,
              title: "Satisfait ou remboursé",
              description: "30 jours pour changer d'avis sur vos achats promo"
            },
            {
              icon: Gift,
              title: "Cadeau surprise",
              description: "Un petit cadeau offert avec chaque commande promotionnelle"
            }
          ].map((advantage, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <advantage.icon className="w-8 h-8 text-rose-custom" />
              </div>
              <h3 className="font-semibold text-textDark mb-2">{advantage.title}</h3>
              <p className="text-gray-600 text-sm">{advantage.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Alertes promotions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center"
        >
          <h3 className="text-xl font-bold text-textDark mb-4">Ne manquez aucune promotion !</h3>
          <p className="text-gray-700 mb-6">
            Inscrivez-vous à notre newsletter et recevez les meilleures offres en avant-première.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Votre email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-custom"
            />
            <button className="bg-rose-custom text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
              S'inscrire
            </button>
          </div>
        </motion.div>

        {/* Retour */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-textDark transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
