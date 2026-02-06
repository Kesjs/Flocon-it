"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Calendar, Heart, Gift, Package, Sparkles, Star, Clock, MapPin, Users } from "lucide-react";
import ChatbotModal from "@/components/ChatbotModal";
import { products, getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function OccasionsPage() {
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Fonction pour obtenir des produits aléatoires d'une catégorie
  const getRandomProducts = (category: string, count: number) => {
    const categoryProducts = getProductsByCategory(category as any);
    const shuffled = [...categoryProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Fonction pour filtrer par mots-clés thématiques
  const getProductsByKeywords = (keywords: string[], count: number) => {
    const filtered = products.filter(product => 
      keywords.some(keyword => 
        product.name.toLowerCase().includes(keyword) || 
        product.description.toLowerCase().includes(keyword) ||
        product.badge?.toLowerCase().includes(keyword)
      )
    );
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Définition des occasions avec produits thématiques
  const occasions = [
    {
      id: "saint-valentin",
      name: "Saint-Valentin",
      description: "L'amour mérite d'être célébré",
      icon: Heart,
      color: "from-rose-400 to-pink-500",
      products: getProductsByCategory("Saint-Valentin") // Tous les 12 produits romantiques
    },
    {
      id: "anniversaire",
      name: "Anniversaire",
      description: "Une année de plus à fêter",
      icon: Gift,
      color: "from-purple-400 to-indigo-500",
      products: getProductsByKeywords(["cadeau", "anniversaire", "fête", "célébration", "bijoux", "montre", "parfum"], 8)
    },
    {
      id: "noel",
      name: "Noël",
      description: "La magie du partage",
      icon: Package,
      color: "from-green-400 to-emerald-500",
      products: getProductsByKeywords(["noël", "hiver", "chaud", "cocooning", "lampe", "bougie", "plaid"], 10)
    },
    {
      id: "fete-des-meres",
      name: "Fête des Mères",
      description: "Pour elle, avec amour",
      icon: Sparkles,
      color: "from-pink-400 to-rose-500",
      products: getProductsByKeywords(["femme", "bijoux", "parfum", "soin", "beauté", "élégant", "fleur"], 6)
    },
    {
      id: "nouveau-ne",
      name: "Nouveau-né",
      description: "Bienvenue dans la vie",
      icon: Gift,
      color: "from-blue-400 to-cyan-500",
      products: getProductsByKeywords(["bébé", "enfant", "doux", "sécurité", "jeu", "éducation", "coussin"], 5)
    },
    {
      id: "remerciement",
      name: "Remerciement",
      description: "Dire merci avec le cœur",
      icon: Heart,
      color: "from-amber-400 to-orange-500",
      products: getProductsByKeywords(["remerciement", "cadeau", "personnalisé", "unique", "spécial", "souvenir"], 7)
    }
  ];

  // Filtrer les produits selon l'occasion sélectionnée
  const getFilteredProducts = () => {
    if (selectedOccasion === "all") {
      return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const occasion = occasions.find(o => o.id === selectedOccasion);
    if (!occasion) return [];

    return occasion.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="pt-28 min-h-screen bg-gray-50">
      {/* Hero Section Occasions */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 lg:py-32 overflow-hidden">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-300 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-green-300 rounded-full opacity-8 animate-pulse delay-500"></div>
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
                <span className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Célébrez Chaque Moment Spécial
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-display font-black text-textDark mb-6 leading-tight">
                Le Cadeau
                <span className="text-rose-custom"> Parfait</span>
                <br />
                pour Chaque Occasion
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                De la Saint-Valentin à l'anniversaire, trouvez le présent idéal qui transformera 
                chaque moment en souvenir inoubliable. Chaque occasion mérite son cadeau unique !
              </p>
              
              {/* Occasions populaires */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {occasions.slice(0, 4).map((occasion, index) => (
                  <div key={index} className="bg-rose-50 rounded-lg p-3 flex items-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer">
                    <occasion.icon className="w-5 h-5 text-rose-custom" />
                    <span className="text-gray-800 text-sm font-medium">{occasion.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#toutes-occasions"
                  className="bg-rose-custom text-white px-8 py-4 rounded-lg font-black hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Explorer les Occasions
                </Link>
                <button className="bg-white text-rose-custom border-2 border-rose-custom px-8 py-4 rounded-lg font-semibold hover:bg-rose-50 transition-all duration-300">
                  Guide des Cadeaux
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
              <div className="relative rounded-3xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-square relative">
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
                    alt="Jeune femme heureuse tenant un cadeau pour les occasions spéciales"
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
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-rose-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Pour quelle occasion cherchez-vous un cadeau ?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-custom focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Filtre d'occasions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
          id="toutes-occasions"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedOccasion("all")}
              className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                selectedOccasion === "all"
                  ? "bg-rose-custom text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Toutes les occasions
            </button>
            {occasions.map((occasion) => (
              <button
                key={occasion.id}
                onClick={() => setSelectedOccasion(occasion.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedOccasion === occasion.id
                    ? "bg-rose-custom text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <occasion.icon className="w-4 h-4" />
                {occasion.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cartes d'occasions détaillées */}
        {selectedOccasion !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            {(() => {
              const occasion = occasions.find(o => o.id === selectedOccasion);
              if (!occasion) return null;

              return (
                <div className={`bg-gradient-to-r ${occasion.color} rounded-2xl p-8 text-white mb-8`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <occasion.icon className="w-8 h-8" />
                        <h2 className="text-3xl font-bold">{occasion.name}</h2>
                      </div>
                      <p className="text-xl opacity-90 mb-4">{occasion.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          <span>{occasion.products.length} cadeaux uniques</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          <span>Personnalisables</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-6xl opacity-20">
                      <occasion.icon className="w-16 h-16" />
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Produits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-textDark">
              {selectedOccasion === "all" 
                ? `${filteredProducts.length} cadeaux pour toutes les occasions`
                : `${filteredProducts.length} cadeaux pour ${occasions.find(o => o.id === selectedOccasion)?.name}`
              }
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Livraison rapide
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product, index) => (
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
              <p className="text-gray-500 mb-4">
                {selectedOccasion === "all" 
                  ? "Aucun produit trouvé pour votre recherche"
                  : `Aucun produit trouvé pour ${occasions.find(o => o.id === selectedOccasion)?.name}`
                }
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedOccasion("all");
                }}
                className="text-rose-custom hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </motion.div>

        {/* Guide des occasions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-textDark mb-8 text-center">Guide des Cadeaux par Occasion</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasions.map((occasion) => (
              <motion.div
                key={occasion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + occasions.indexOf(occasion) * 0.1 }}
                className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedOccasion(occasion.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <occasion.icon className="w-6 h-6 text-rose-custom" />
                  <h3 className="font-semibold text-textDark">{occasion.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{occasion.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{occasion.products.length} produits</span>
                  <button className="text-rose-custom hover:text-rose-custom/80 text-sm font-medium">
                    Explorer →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Section inspiration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8"
        >
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-rose-custom mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-textDark mb-4">Besoin d'inspiration ?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Notre équipe d'experts vous aide à trouver le cadeau parfait. Découvrez nos sélections thématiques et nos conseils personnalisés.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-rose-custom text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                Consulter le guide
              </button>
              <button className="bg-white text-rose-custom border border-rose-custom px-6 py-3 rounded-lg hover:bg-rose-50 transition-colors">
                Contactez un expert
              </button>
            </div>
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
