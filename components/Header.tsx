"use client";

import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Search, User, ShoppingCart, Menu, X, Package, Heart, Settings, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "./ProgressBar";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, signOut, loading } = useAuth();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldBeScrolled = scrollPosition > 10; // Réduit à 10px pour déclencher plus tôt
      console.log('Scroll position:', scrollPosition, 'Should be scrolled:', shouldBeScrolled);
      setIsScrolled(shouldBeScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        suppressHydrationWarning
        className={`fixed left-0 right-0 z-50 border-b border-gray-200/50 transition-all duration-300 bg-white shadow-lg`}
        animate={{ top: isScrolled ? 0 : 32 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/logof.jpg?v=1"
                alt="Flocon Logo"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-2xl font-display font-bold" style={{ color: '#e72281' }}>
                Flocon
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/#collection-hiver" className="text-textDark hover:text-rose-custom-custom transition-all duration-300 font-medium relative group">
                  <span className="relative">
                    L'Art du Cocooning
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                      style={{ backgroundColor: 'var(--rose)' }}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/#collection-valentin" className="text-textDark hover:text-rose-custom-custom transition-all duration-300 font-medium relative group">
                  <span className="relative">
                    Flocons de Tendresse
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                      style={{ backgroundColor: 'var(--rose)' }}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/boutique" className="text-textDark hover:text-rose-custom-custom transition-all duration-300 font-medium relative group">
                  <span className="relative">
                    Boutique
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                      style={{ backgroundColor: 'var(--rose)' }}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </span>
                </Link>
              </motion.div>
            </nav>

            {/* Actions Right */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.div 
                className="hidden sm:flex items-center bg-gray-100/50 rounded-full px-4 py-2 group"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: isScrolled ? 360 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Search className="w-4 h-4 text-gray-600 group-hover:text-rose-custom-custom transition-colors duration-200" />
                </motion.div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="ml-2 bg-transparent border-none outline-none text-sm w-32 group-hover:w-40 transition-all duration-300"
                />
              </motion.div>

              {/* Profile */}
              <div className="relative">
                {loading ? (
                  <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <>
                    <motion.button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-2 px-4 py-2 text-rose-custom hover:bg-rose-custom/10 rounded-full transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotate: isProfileDropdownOpen ? 360 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--rose)' }}>
                          <span className="text-white text-xs font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                      <span className="text-sm font-medium text-black group-hover:text-rose-custom transition-colors duration-200">Mon compte</span>
                    </motion.button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200/50 py-4 z-[100]"
                        >
                          {/* User Info Header */}
                          <div className="px-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--rose)' }}>
                                <span className="text-white text-lg font-semibold">
                                  {user.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-textDark">
                                  {user.user_metadata?.full_name || user.email}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              href="/dashboard"
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Settings className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-textDark group-hover:text-rose-custom-custom transition-colors">Tableau de bord</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>

                            <Link
                              href="/orders"
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-textDark group-hover:text-rose-custom-custom transition-colors">Mes commandes</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>

                            <Link
                              href="/wishlist"
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Heart className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-textDark group-hover:text-rose-custom-custom transition-colors">Ma wishlist</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                          </div>

                          {/* Footer */}
                          <div className="pt-4 border-t border-gray-100">
                            <button
                              className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full group"
                              onClick={async () => {
                                setIsProfileDropdownOpen(false);
                                await signOut();
                              }}
                            >
                              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                <LogOut className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="text-red-600 group-hover:text-red-700 transition-colors">Déconnexion</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link href="/login">
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 text-rose-custom hover:bg-rose-custom/10 rounded-full transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Se connecter</span>
                    </motion.button>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <motion.button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: cartCount > 0 ? 360 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <ShoppingCart className="w-5 h-5 text-textDark group-hover:text-rose-custom-custom transition-colors duration-200" />
                </motion.div>
                {cartCount > 0 && (
                  <motion.span 
                    className="absolute top-0 right-0 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: 'var(--rose)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 group"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5 text-textDark group-hover:text-rose-custom-custom transition-colors duration-200" />
                  ) : (
                    <Menu className="w-5 h-5 text-textDark group-hover:text-rose-custom-custom transition-colors duration-200" />
                  )}
                </motion.div>
              </motion.button>

            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="md:hidden pb-4 border-t border-gray-200/50 mt-4 pt-4 overflow-hidden"
              >
                <nav className="flex flex-col space-y-4">
                  {["L'Art du Cocooning", "Flocons de Tendresse", "Boutique"].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 + 0.1 }}
                    >
                      <Link
                        href={item === "L'Art du Cocooning" ? "/#collection-hiver" : item === "Flocons de Tendresse" ? "/#collection-valentin" : "/boutique"}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-textDark hover:text-rose-custom-custom transition-all duration-300 font-medium relative group block py-2"
                      >
                        <span className="relative">
                          {item}
                          <motion.div 
                            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
                            style={{ backgroundColor: 'var(--rose)' }}
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                    className="flex items-center bg-gray-100/50 rounded-full px-4 py-2 mt-2 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Search className="w-4 h-4 text-gray-600 group-hover:text-rose-custom-custom transition-colors duration-200" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="ml-2 bg-transparent border-none outline-none text-sm flex-1 group-hover:w-40 transition-all duration-300"
                    />
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Barre de progression horizontale */}
        <ProgressBar />
      </motion.header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
