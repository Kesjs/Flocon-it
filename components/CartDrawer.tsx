"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNProgress } from "@/hooks/useNProgress";
import { X, Plus, Minus, Trash2, ShoppingBag, Heart, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);
  const { start: startProgress, done: doneProgress } = useNProgress();

  // Attendre l'hydratation du contexte
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  const handleCheckout = async () => {
    console.log('🔘 Bouton "COMMANDER" du CartDrawer cliqué');
    setIsLoading(true);
    startProgress(); // Démarrer NProgress
    
    try {
      // Vérifier si l'utilisateur est connecté
      console.log('🔍 Vérification authentification utilisateur:', user ? 'Connecté' : 'Non connecté');
      
      if (!user) {
        console.log('🚪 Utilisateur non connecté, redirection vers login');
        // Rediriger immédiatement vers login avec intention de checkout
        router.push('/login?redirect=checkout');
        return;
      }
      
      // Rediriger vers la page de checkout avec router natif
      console.log('🔄 Redirection vers /checkout (router natif)');
      router.push('/checkout');
      
    } catch (error) {
      console.error('Erreur lors du traitement de la commande:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
      doneProgress(); // Arrêter NProgress en cas d'erreur
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-display font-bold text-textDark">
                Mon panier
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Votre panier est vide</p>
                  <Link
                    href="/"
                    onClick={onClose}
                    className="text-rose-custom hover:underline"
                  >
                    Continuer vos achats
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border rounded-lg"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          {item.image && !imageErrors.has(item.id) ? (
                            <OptimizedImage
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(item.id)}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500 text-center px-1">Img</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-textDark mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.price.toFixed(2)} €
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-1 hover:bg-red-50 rounded text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 md:p-6 space-y-4">
              {!isHydrated ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-rose-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement du panier...</p>
                </div>
              ) : cartItems.length > 0 ? (
                <>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  
                  {/* Message d'information */}
                  <div className="text-xs text-gray-500 text-center">
                    {cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || cartItems.length === 0}
                    className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                      isLoading || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Commande en cours...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>COMMANDER</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  {/* Options supplémentaires */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                          alert('Fonctionnalité de sauvegarde en cours de développement');
                        }, 1000);
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium md:text-xs"
                    >
                      <Heart className="w-4 h-4 inline mr-1" />
                      <span className="hidden sm:inline">Sauvegarder</span>
                      <span className="sm:hidden">💾</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Vider le panier ?')) {
                          clearCart();
                          onClose();
                        }
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors text-sm font-medium md:text-xs"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      <span className="hidden sm:inline">Vider</span>
                      <span className="sm:hidden">🗑️</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Votre panier est vide</p>
                  <button
                    onClick={() => {
                      onClose();
                      // Rediriger vers la boutique
                      window.location.href = '/boutique';
                    }}
                    className="mt-4 text-rose-custom hover:text-rose-custom/80 font-medium"
                  >
                    Commencer mes achats
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
