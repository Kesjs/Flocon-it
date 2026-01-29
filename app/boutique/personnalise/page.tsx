"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Camera, PenTool, Scissors, Heart, Gift, Star, Sparkles, Palette, Brush, Type, Filter } from "lucide-react";
import ChatbotModal from "@/components/ChatbotModal";
import { useProductDisplay } from "@/hooks/useProductDisplay";
import ProductCard from "@/components/ProductCard";

export default function PersonnalisePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  // Utiliser le nouveau système de configuration
  const { sections } = useProductDisplay('personnalise');
  const personalizedProducts = sections[0]?.products || [];

  const filteredProducts = personalizedProducts.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-28 min-h-screen bg-gray-50">
      {/* Hero Section Personnalisée */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu Gauche */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-rose-custom px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  L'Art de la Personnalisation
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-display font-black text-textDark mb-6 leading-tight">
                Transformez vos
                <span className="text-rose-custom"> Souvenirs</span>
                <br />
                en Cadeaux Uniques
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Ajoutez vos photos, vos messages et créez des présents qui marquent les esprits. 
                Chaque détail compte pour rendre votre cadeau inoubliable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="#types-personnalisation"
                  className="bg-rose-custom text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Commencer à Personnaliser
                </Link>
                <button className="bg-white text-rose-custom border-2 border-rose-custom px-8 py-4 rounded-lg font-semibold hover:bg-rose-50 transition-all duration-300">
                  Voir les Exemples
                </button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-rose-custom" />
                  <span>Photos HD</span>
                </div>
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-rose-custom" />
                  <span>Textes personnalisés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-rose-custom" />
                  <span>Qualité premium</span>
                </div>
              </div>
            </motion.div>

            {/* Contenu Droit - Image Réelle */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-square relative">
                  <img
                    src="https://placeducouple.com/images/Images%20Blog/CHZ_STVAL25_LIFESTYLE_MAINS_vlb-1.jpg?1737469425778"
                    alt="Personnalisation de cadeaux avec les mains"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  {/* Overlay très léger */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
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
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Quel cadeau souhaitez-vous personnaliser aujourd'hui ?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-custom focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Types de personnalisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          id="types-personnalisation"
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-textDark mb-8 text-center">Types de personnalisation</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Photo",
                description: "Ajoutez vos plus beaux souvenirs",
                icon: Camera,
                color: "bg-blue-100 text-blue-600"
              },
              {
                title: "Texte",
                description: "Messages et citations personnalisées",
                icon: PenTool,
                color: "bg-green-100 text-green-600"
              },
              {
                title: "Gravure",
                description: "Gravures durables et élégantes",
                icon: Type,
                color: "bg-purple-100 text-purple-600"
              },
              {
                title: "Broderie",
                description: "Touches personnelles brodées",
                icon: Scissors,
                color: "bg-pink-100 text-pink-600"
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-textDark mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Produits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-textDark">
              {filteredProducts.length} cadeaux personnalisés
            </h2>
            <button className="flex items-center gap-2 text-gray-600 hover:text-textDark">
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucun produit trouvé pour "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="text-rose-custom hover:underline"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </motion.div>

        {/* Guide de personnalisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-white rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-textDark mb-6">Comment personnaliser votre cadeau ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choisissez votre cadeau",
                description: "Parcourez notre sélection et trouvez le produit parfait pour votre occasion."
              },
              {
                step: "2", 
                title: "Ajoutez votre touche personnelle",
                description: "Téléchargez vos photos, écrivez votre message ou choisissez votre gravure."
              },
              {
                step: "3",
                title: "Validez et recevez",
                description: "Prévisualisez votre création et recevez votre cadeau unique chez vous."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-rose-custom text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-textDark mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
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
