"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface RedirectOverlayProps {
  isVisible: boolean;
}

export default function RedirectOverlay({ isVisible }: RedirectOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <div className="relative">
              <Lock className="w-8 h-8 text-rose-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sécurisation de votre session...
            </h3>
            <p className="text-sm text-gray-600">
              Redirection vers l'authentification sécurisée
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>Veuillez patienter...</p>
            <p className="font-medium">Connexion SSL 256-bit</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
