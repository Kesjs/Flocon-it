"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNProgress } from "@/hooks/useNProgress";

interface PageLoaderProps {
  isLoading?: boolean;
  message?: string;
}

export function PageLoader({ isLoading = false, message = "Chargement..." }: PageLoaderProps) {
  const { start, done } = useNProgress();

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      done();
    }
  }, [isLoading, start, done]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-rose-400 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
            </div>
            <p className="text-gray-600 font-medium animate-pulse">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Loader plus compact pour les boutons
export function MiniLoader({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
}
