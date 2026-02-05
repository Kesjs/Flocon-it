"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export function RedirectLoader() {
  const { isRedirecting } = useAuth();

  return (
    <>
      {isRedirecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
        >
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-rose-400 rounded-full animate-spin" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Préparation de votre espace sécurisé...
              </h3>
              <p className="text-sm text-gray-600">
                Vous serez redirigé dans un instant
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}
