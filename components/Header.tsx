"use client";

import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Search, User, ShoppingCart, Menu, X, Package, Heart, Settings, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Prefetch stratégique pour les pages critiques
  useEffect(() => {
    // Précharger les pages stratégiques au montage du composant
    router.prefetch('/checkout');
    router.prefetch('/dashboard');
    router.prefetch('/login');
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldBeScrolled = scrollPosition > 20; // Seuil très bas pour réactivité maximale
      setIsScrolled(shouldBeScrolled);
    };

    // Throttling pour performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  return (
    <>
      <motion.header
        suppressHydrationWarning
        animate={{
          top: isScrolled ? 0 : 32, // 32px = 8px * 4 (taille réelle de l'announce bar)
          zIndex: isScrolled ? 50 : 40,
        }}
        transition={{
          top: {
            type: "spring",
            stiffness: 200, // Plus rigide pour plus de réactivité
            damping: 25,    // Plus d'amortissement pour moins de rebond
            mass: 0.8,      // Plus léger
          },
          zIndex: { duration: 0 }
        }}
        className="fixed left-0 right-0 border-b border-gray-200/50 bg-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <img
                src="/logof.jpg?v=1"
                alt="Flocon Logo"
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <div className="text-lg sm:text-2xl font-display font-bold" style={{ color: '#e72281' }}>
                Flocon
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <motion.div
                whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
                transition={{ duration: 0.2 }}
                className="px-3 py-2 rounded-lg transition-all duration-200"
              >
                <Link href="/#collection-hiver" className="text-textDark hover:text-rose-custom-custom transition-all duration-300 font-medium relative group" prefetch={false}>
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
                whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
                transition={{ duration: 0.2 }}
                className="px-3 py-2 rounded-lg transition-all duration-200"
              >
                <Link href="/#collection-valentin" className="text-textDark hover:text-rose-custom-custom transition-all duration-300 font-medium relative group" prefetch={false}>
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
                whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
                transition={{ duration: 0.2 }}
                className="px-3 py-2 rounded-lg transition-all duration-200"
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

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Desktop only */}
              <div className="hidden md:flex items-center bg-gray-100/50 rounded-full px-3 py-2 group">
                <motion.div
                  animate={{ rotate: isScrolled ? 360 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Search className="w-4 h-4 text-gray-600 group-hover:text-rose-custom-custom transition-colors duration-200" />
                </motion.div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="ml-2 bg-transparent border-none outline-none text-sm w-24 sm:w-32 group-hover:w-32 sm:group-hover:w-40 transition-all duration-300"
                />
              </div>

              {/* Profile */}
              <div className="relative">
                {loading ? (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 rounded-full animate-pulse"></div>
                ) : user ? (
                  <>
                    <motion.button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="hidden sm:flex items-center space-x-2 px-3 sm:px-4 py-2 text-rose-custom hover:bg-rose-custom/10 rounded-full transition-all duration-200 group"
                      whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                      whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotate: isProfileDropdownOpen ? 360 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--rose)' }}>
                          <span className="text-white text-xs font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                      <span className="text-sm font-medium text-black group-hover:text-rose-custom transition-colors duration-200 hidden lg:block">Mon compte</span>
                    </motion.button>

                    {/* Mobile Profile Button */}
                    <motion.button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="sm:hidden p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200"
                      whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                      whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--rose)' }}>
                        <span className="text-white text-xs font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
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
                                <div className="w-8 h-8 bg-rose-custom/10 rounded-lg flex items-center justify-center">
                                  <Package className="w-4 h-4 text-rose-custom" />
                                </div>
                                <div>
                                  <span className="text-textDark group-hover:text-rose-custom-custom transition-colors font-medium">Mes commandes</span>
                                  <span className="text-xs text-gray-500 block">Voir mes achats</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>

                            <Link
                              href="/dashboard"
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Settings className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <span className="text-textDark group-hover:text-rose-custom-custom transition-colors font-medium">Tableau de bord</span>
                                  <span className="text-xs text-gray-500 block">Gérer mon compte</span>
                                </div>
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
                  <>
                    {/* Desktop Login Button */}
                    <Link href="/login" className="hidden sm:block">
                      <motion.button
                        className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-rose-custom hover:bg-rose-custom/10 rounded-full transition-all duration-200 group"
                        whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                        whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium hidden lg:block">Se connecter</span>
                      </motion.button>
                    </Link>
                    
                    {/* Mobile Login Button */}
                    <Link href="/login" className="sm:hidden">
                      <motion.button
                        className="p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 group"
                        whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                        whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <User className="w-5 h-5 text-textDark group-hover:text-rose-custom-custom transition-colors duration-200" />
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>

              {/* Cart */}
              <motion.button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 group"
                whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
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
                className="lg:hidden p-2 hover:bg-gray-100/50 rounded-full transition-all duration-200 group"
                whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)', rotate: 90 }}
                whileTap={{ backgroundColor: 'rgba(231, 34, 129, 0.15)' }}
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
                className="lg:hidden pb-4 border-t border-gray-200/50 mt-4 pt-4 overflow-hidden"
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
                        prefetch={false}
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
                    className="flex items-center bg-gray-100/50 rounded-full px-3 py-2 mt-2 group"
                    whileHover={{ backgroundColor: 'rgba(231, 34, 129, 0.1)' }}
                  >
                    <Search className="w-4 h-4 text-gray-600 group-hover:text-rose-custom-custom transition-colors duration-200" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="ml-2 bg-transparent border-none outline-none text-sm flex-1 group-hover:w-32 transition-all duration-300"
                    />
                  </motion.div>

                  {/* Mobile Profile/Login */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 }}
                  >
                    {loading ? (
                      <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : user ? (
                      <div className="flex items-center space-x-3 px-3 py-2 bg-rose-custom/10 rounded-full">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--rose)' }}>
                          <span className="text-white text-xs font-semibold">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-black">Mon compte</span>
                      </div>
                    ) : (
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <div className="flex items-center space-x-3 px-3 py-2 bg-rose-custom/10 rounded-full">
                          <User className="w-4 h-4 text-rose-custom" />
                          <span className="text-sm font-medium text-rose-custom">Se connecter</span>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => setIsCheckoutOpen(true)} 
      />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
}
