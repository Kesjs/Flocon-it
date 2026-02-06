"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearCartAfterPayment: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "flocon-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useAuth(); // Récupérer le statut de connexion

  // Charger le panier depuis localStorage au montage (SEULEMENT si utilisateur connecté)
  useEffect(() => {
    // Ne charger le panier que si l'utilisateur est connecté
    if (!user) {
      setIsHydrated(true);
      return;
    }

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, [user]); // Dépend de l'utilisateur

  // Vider le panier si l'utilisateur se déconnecte
  useEffect(() => {
    if (!user && isHydrated) {
      clearCart();
    }
  }, [user, isHydrated]);

  // Sauvegarder le panier dans localStorage à chaque changement (SEULEMENT si connecté)
  useEffect(() => {
    if (isHydrated && user) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du panier:", error);
      }
    }
  }, [cartItems, isHydrated, user]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
    }
  };

  const clearCartAfterPayment = () => {
    // Vider le panier et sauvegarder dans localStorage
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      // Optionnel: sauvegarder un indicateur de paiement réussi
      localStorage.setItem('last-payment', new Date().toISOString());
    } catch (error) {
      console.error("Erreur lors de la suppression du panier après paiement:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, clearCartAfterPayment }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
