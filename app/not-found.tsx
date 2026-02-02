"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ShoppingBag, Search, ArrowRight, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-iceBlue/20 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold text-rose-custom mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-textDark mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Oops! La page que vous cherchez semble avoir fondue comme neige au soleil.<br />
            Retournons à nos créations chaleureuses !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Boutons principaux */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/">
              <motion.button
                className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--rose)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Home className="w-5 h-5" />
                Retour à l'accueil
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link href="/boutique">
              <motion.button
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-rose-custom text-rose-custom rounded-lg font-medium hover:bg-rose-custom hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag className="w-5 h-5" />
                Explorer la boutique
              </motion.button>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-textDark mb-4">Vous cherchiez peut-être :</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link 
                href="/#collection-hiver"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  ❄️
                </div>
                <div>
                  <div className="font-medium text-textDark">L'Art du Cocooning</div>
                  <div className="text-sm text-gray-500">Collection Hiver</div>
                </div>
              </Link>

              <Link 
                href="/#collection-valentin"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  💕
                </div>
                <div>
                  <div className="font-medium text-textDark">Flocons de Tendresse</div>
                  <div className="text-sm text-gray-500">Saint-Valentin</div>
                </div>
              </Link>

              <Link 
                href="/boutique/personnalise"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  ✨
                </div>
                <div>
                  <div className="font-medium text-textDark">Cadeaux Personnalisés</div>
                  <div className="text-sm text-gray-500">Sur-mesure</div>
                </div>
              </Link>

              <Link 
                href="/contact"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  📧
                </div>
                <div>
                  <div className="font-medium text-textDark">Contact</div>
                  <div className="text-sm text-gray-500">Besoin d'aide ?</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="flex-1 outline-none text-textDark"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/boutique?search=${encodeURIComponent(e.currentTarget.value)}`;
                  }
                }}
              />
              <Link 
                href="/boutique"
                className="px-4 py-2 text-rose-custom hover:bg-rose-custom/10 rounded-lg transition-colors font-medium"
              >
                Rechercher
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Animation décorative */}
        <motion.div
          className="absolute top-10 left-10 text-4xl opacity-20"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ❄️
        </motion.div>

        <motion.div
          className="absolute top-20 right-20 text-3xl opacity-20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          💕
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 text-3xl opacity-20"
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="w-16 h-16 text-rose-custom" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
