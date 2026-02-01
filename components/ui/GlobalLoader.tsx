'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  isLoading: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

export default function GlobalLoader({ 
  isLoading, 
  text = 'Chargement...', 
  size = 'md',
  overlay = true 
}: GlobalLoaderProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const content = (
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Loader2 className={`${sizeClasses[size]} text-rose-custom animate-spin`} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`${textSizeClasses[size]} text-gray-600 font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
