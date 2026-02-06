"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNProgress } from "@/hooks/useNProgress";
import { X, Plus, Minus, Trash2, ShoppingBag, Heart, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { start: startProgress, done: doneProgress } = useNProgress();
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydratation client-side
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Prefetch intelligent
  useEffect(() => {
    if (isOpen) router.prefetch('/checkout');
  }, [isOpen, router]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsRedirecting(true);
    startProgress();
    
    try {
      // 1. Attente si l'auth est encore en train de charger
      if (authLoading) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // 2. Vérification de l'utilisateur
      if (!user) {
        onClose();
        router.push('/login?redirect=checkout');
        return;
      }
      
      // 3. Vérification de session réelle via Supabase (Double Check)
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      if (!supabase) {
        console.error('❌ Supabase client non disponible');
        setIsRedirecting(false);
        doneProgress();
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        onClose();
        router.push('/login?redirect=checkout');
        return;
      }
      
      // 4. Redirection finale
      onClose();
      router.push('/checkout');
      
    } catch (error) {
      console.error('Checkout Error:', error);
      setIsRedirecting(false);
      doneProgress();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop avec flou léger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col"
          >
            {/* Header Stylisé */}
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-serif italic text-stone-900">Mon Panier</h2>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  {cartItems.length} {cartItems.length > 1 ? 'Articles' : 'Article'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-stone-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!isHydrated ? (
                <div className="h-full flex items-center justify-center">
                   <Loader2 className="animate-spin text-stone-200" size={32} />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="text-stone-300" size={24} />
                  </div>
                  <p className="text-stone-500 font-serif italic">Votre panier est vide</p>
                  <button onClick={onClose} className="text-xs font-bold uppercase tracking-widest text-rose-custom hover:opacity-70 transition-opacity">
                    Découvrir la collection
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="flex gap-4 group"
                  >
                    {/* Image Placeholder optimisé */}
                    <div className="relative w-20 h-24 bg-stone-100 rounded-xl overflow-hidden shrink-0 border border-stone-50">
                      {item.image && !imageErrors.has(item.id) ? (
                        <OptimizedImage
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={() => setImageErrors(prev => new Set(prev).add(item.id))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="text-stone-200" size={16}/></div>
                      )}
                    </div>

                    {/* Info Produit */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-semibold text-stone-800 line-clamp-1">{item.name}</h3>
                        <p className="text-xs font-medium text-stone-400 mt-1">{item.price.toFixed(2)} €</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-stone-100 rounded-lg p-1 bg-stone-50/50">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:text-rose-custom transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-rose-custom transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sticky Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-stone-100 space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total estimation</span>
                  <span className="text-2xl font-serif italic text-stone-900">{total.toFixed(2)} €</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isRedirecting}
                  className="w-full relative group overflow-hidden bg-stone-900 text-white py-4 rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-stone-200"
                >
                  <AnimatePresence mode="wait">
                    {isRedirecting ? (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <Loader2 className="animate-spin" size={18} />
                        <span className="text-xs uppercase tracking-widest">Sécurisation...</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <CreditCard size={18} />
                        <span className="text-xs uppercase tracking-widest">Passer à la commande</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Actions Secondaires */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-2 border border-stone-100 rounded-xl text-[10px] font-bold uppercase tracking-tighter text-stone-500 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                    <Heart size={12} /> Favoris
                  </button>
                  <button 
                    onClick={() => confirm('Vider le panier ?') && clearCart()}
                    className="flex-1 py-3 px-2 border border-stone-100 rounded-xl text-[10px] font-bold uppercase tracking-tighter text-stone-500 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={12} /> Vider
                  </button>
                </div>
                
                <p className="text-center text-[9px] text-stone-300 uppercase tracking-widest">
                  Paiement sécurisé par FST & Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}