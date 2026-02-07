"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Shield, Lock, CreditCard, Info, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { CheckoutService } from "@/lib/checkout-service";
import { 
  isValidEmail, isValidName, isValidAddress, isValidCity, 
  isValidPostalCode, validatePhoneWithMessage 
} from "@/lib/validation";
import { RedirectManager } from "@/lib/redirect-manager";
import { useNProgress } from "@/hooks/useNProgress";
import { CheckoutSkeleton } from "@/components/ui/skeleton";
import RedirectOverlay from "@/components/ui/redirect-overlay";
import { ALL_COUNTRIES, DEFAULT_COUNTRY, filterCountries } from "@/lib/countries";
import { filterCitiesByCountry } from "@/lib/world-cities";
import ErrorBoundaryCheckout from "@/components/ErrorBoundaryCheckout";
import { formatPhoneNumber, getPhoneType, getPhoneExample } from "@/lib/phone-utils";

export default function Checkout() {
  return (
    <ErrorBoundaryCheckout>
      <CheckoutContent />
    </ErrorBoundaryCheckout>
  );
}

function CheckoutContent() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { start: startProgress, done: doneProgress } = useNProgress();

  // --- ÉTATS ---
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartHydrated, setIsCartHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Localisation
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(ALL_COUNTRIES);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [shippingAddress, setShippingAddress] = useState({
    name: '', address: '', city: '', postalCode: '', phone: '', country: DEFAULT_COUNTRY.code
  });

  // --- LOGIQUE D'HYDRATATION & RESTAURATION ---
  useEffect(() => {
    setIsHydrated(true);
    
    // Attendre que le panier soit chargé depuis localStorage
    const checkCartHydration = () => {
      // Si le panier a des éléments ou si localStorage est vide, c'est bon
      const savedCart = localStorage.getItem('flocon-cart');
      if (savedCart !== null || cartItems.length > 0) {
        setIsCartHydrated(true);
      }
    };
    
    // Vérifier immédiatement
    checkCartHydration();
    
    // Et vérifier après un petit délai au cas où
    const timer = setTimeout(checkCartHydration, 100);
    
    const saved = localStorage.getItem('checkout-shipping-address');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setShippingAddress(parsed);
        setCustomerEmail(localStorage.getItem('checkout-email') || '');
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
    
    // Check Intent
    const intent = RedirectManager.getIntent();
    if (intent?.type === 'checkout' && intent.data) {
      setShippingAddress(prev => ({ ...prev, ...intent.data.shippingAddress }));
      setCustomerEmail(intent.data.email || '');
      RedirectManager.clearIntent();
    }
    
    return () => clearTimeout(timer);
  }, [cartItems.length]);

  // Auto-save debounce
  useEffect(() => {
    if (!isHydrated) return;
    const timer = setTimeout(() => {
      localStorage.setItem('checkout-shipping-address', JSON.stringify(shippingAddress));
      localStorage.setItem('checkout-email', customerEmail);
    }, 1000);
    return () => clearTimeout(timer);
  }, [shippingAddress, customerEmail, isHydrated]);

  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  // --- VALIDATION INLINE ---
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isValidEmail(customerEmail)) errs.email = "Email invalide";
    if (!isValidName(shippingAddress.name)) errs.name = "Nom requis (lettres uniquement)";
    if (!isValidAddress(shippingAddress.address)) errs.address = "Adresse trop courte";
    if (!isValidCity(shippingAddress.city)) errs.city = "Ville requise";
    if (!isValidPostalCode(shippingAddress.postalCode)) errs.postalCode = "Format : 75000";
    
    const phoneVal = validatePhoneWithMessage(shippingAddress.phone, selectedCountry.code);
    if (!phoneVal.isValid) errs.phone = phoneVal.message;

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // --- HANDLERS ---
  const handlePayment = async (method: 'card' | 'fst') => {
    if (!validate()) return;
    
    if (!user) {
      RedirectManager.setCheckoutIntent({ email: customerEmail, shippingAddress });
      startProgress();
      router.push('/login?callbackUrl=/checkout');
      return;
    }

    setIsProcessing(true);
    startProgress();

    try {
      if (method === 'fst') {
        const res = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartItems, customerEmail, shippingAddress, payment_method: 'fst', total })
        });
        const order = await res.json();
        router.push(`/checkout/fst?order_id=${order.id}`);
      } else {
        const result = await CheckoutService.processPayment(user.id, cartItems, shippingAddress, 'card');
        if (result.success) {
          clearCart();
          setIsComplete(true);
        }
      }
    } catch (e) {
      setValidationErrors({ global: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsProcessing(false);
      doneProgress();
    }
  };

  // --- HANDLERS LOCALISATION ---
  const handleCountrySearch = (searchTerm: string) => {
    setCountrySearch(searchTerm);
    
    if (searchTerm.length >= 2) {
      const countries = filterCountries(searchTerm);
      setFilteredCountries(countries);
      setShowCountryDropdown(countries.length > 0);
    } else {
      setShowCountryDropdown(false);
      setFilteredCountries(ALL_COUNTRIES);
    }
  };

  const selectCountry = (country: typeof DEFAULT_COUNTRY) => {
    setSelectedCountry(country);
    setShippingAddress(prev => ({ ...prev, country: country.code }));
    setCountrySearch('');
    setShowCountryDropdown(false);
    setFilteredCountries([]);
    
    // Reset city when country changes
    setCitySearch('');
    setShippingAddress(prev => ({ ...prev, city: '' }));
  };

  const handleCitySearch = (searchTerm: string) => {
    setCitySearch(searchTerm);
    setShippingAddress(prev => ({ ...prev, city: searchTerm }));
    
    if (searchTerm.length >= 2) {
      const cities = filterCitiesByCountry(selectedCountry.code, searchTerm);
      setFilteredCities(cities);
      setShowCityDropdown(cities.length > 0);
    } else {
      setShowCityDropdown(false);
      setFilteredCities([]);
    }
  };

  const selectCity = (city: string) => {
    setShippingAddress(prev => ({ ...prev, city }));
    setCitySearch(city);
    setShowCityDropdown(false);
    setFilteredCities([]);
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.country-search-container')) {
        setShowCountryDropdown(false);
      }
      if (!target.closest('.city-search-container')) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isHydrated || !isCartHydrated) return <CheckoutSkeleton />;

  // Détecter si on est en train de rediriger vers login
  const isRedirectingToLogin = isProcessing && !user;

  // Si le panier est vide, afficher un message
  if (cartItems.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-[#FDFCFB] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-500 mb-6">Ajoutez des produits avant de finaliser votre commande</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-[#FDFCFB] pb-32 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLONNE GAUCHE : FORMULAIRE */}
        <div className="lg:col-span-7 space-y-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-rose-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour boutique
          </Link>

          <header>
            <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
            <p className="text-gray-500 mt-2">Complétez vos informations pour l'expédition sécurisée.</p>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
            {/* Section Email */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
                <Shield className="w-5 h-5" />
                <h2 className="font-semibold text-gray-900">Informations de contact</h2>
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${validationErrors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-rose-500/20 outline-none transition-all`}
                />
                {validationErrors.email && <span className="text-xs text-red-500 mt-1">{validationErrors.email}</span>}
              </div>
            </section>

            {/* Section Adresse */}
            <section className="space-y-4 pt-4 border-t border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" /> Adresse de livraison
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                  {validationErrors.name && <span className="text-xs text-red-500">{validationErrors.name}</span>}
                </div>

                <div className="md:col-span-2 relative country-search-container">
                  <input
                    type="text"
                    value={countrySearch || `${selectedCountry.flag} ${selectedCountry.name}`}
                    onChange={(e) => handleCountrySearch(e.target.value)}
                    onFocus={() => {
                      if (countrySearch.length >= 2) {
                        const countries = filterCountries(countrySearch);
                        setFilteredCountries(countries);
                        setShowCountryDropdown(countries.length > 0);
                      } else {
                        setFilteredCountries(ALL_COUNTRIES);
                        setShowCountryDropdown(true);
                      }
                    }}
                    placeholder="Rechercher un pays..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-rose-500/20 outline-none"
                    autoComplete="off"
                  />
                  
                  <AnimatePresence>
                    {showCountryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                      >
                        {filteredCountries.map((country, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectCountry(country)}
                            className="w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors border-b border-gray-50 last:border-b-0 flex items-center gap-3"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{country.name}</div>
                              <div className="text-xs text-gray-500">{country.phoneCode} • {country.currency}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Adresse (Rue, numéro, appartement)"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>

                <div className="relative city-search-container">
                  <input
                    type="text"
                    value={citySearch || shippingAddress.city}
                    onChange={(e) => handleCitySearch(e.target.value)}
                    onFocus={() => {
                      if (citySearch.length >= 2) {
                        const cities = filterCitiesByCountry(selectedCountry.code, citySearch);
                        setFilteredCities(cities);
                        setShowCityDropdown(cities.length > 0);
                      }
                    }}
                    placeholder={`Ville en ${selectedCountry.name}...`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 outline-none"
                    autoComplete="off"
                  />
                  
                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                      >
                        {filteredCities.map((city, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectCity(city)}
                            className="w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors border-b border-gray-50 last:border-b-0"
                          >
                            {city}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <input
                  type="text"
                  placeholder="Code Postal"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <div className="flex gap-2">
                    {/* Préfixe pays */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors min-w-[120px] flex items-center justify-between gap-2"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{selectedCountry.flag}</span>
                          <span className="text-sm font-medium">{selectedCountry.phoneCode}</span>
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <AnimatePresence>
                        {showCountryDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                          >
                            {filteredCountries.map((country, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => selectCountry(country)}
                                className="w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors border-b border-gray-50 last:border-b-0 flex items-center gap-3"
                              >
                                <span className="text-lg">{country.flag}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{country.name}</div>
                                  <div className="text-xs text-gray-500">{country.phoneCode}</div>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Input téléphone */}
                    <div className="flex-1 relative">
                      <input
                        type="tel"
                        placeholder={getPhoneExample(selectedCountry.code)}
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: formatPhoneNumber(e.target.value, selectedCountry.code)})}
                        className={`w-full px-4 py-3 rounded-xl border ${validationErrors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-rose-500/20 outline-none transition-all`}
                      />
                      {shippingAddress.phone && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {getPhoneType(shippingAddress.phone) === 'mobile' ? (
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center" title="Mobile">
                              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </div>
                          ) : getPhoneType(shippingAddress.phone) === 'fixe' ? (
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center" title="Fixe">
                              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  {validationErrors.phone && <span className="text-xs text-red-500 mt-1">{validationErrors.phone}</span>}
                  <p className="text-xs text-gray-500 mt-1">
                    Format: {selectedCountry.phoneCode} • Mobile/Fixe • Ex: {getPhoneExample(selectedCountry.code)}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* COLONNE DROITE : RÉCAPITULATIF (STICKY) */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Résumé du panier</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Votre panier est vide</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                        {item.image && !imageErrors.has(item.id) ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(item.id)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{(item.price * item.quantity).toLocaleString()}€</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Sous-total</span>
                  <span>{total.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Livraison</span>
                  <span className="text-emerald-600 font-medium">Offerte</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3">
                  <span>Total</span>
                  <span>{total.toLocaleString()}€</span>
                </div>
              </div>

              {/* BOUTON ACTION */}
              <div className="mt-8">
                <button
                  onClick={() => handlePayment('fst')}
                  disabled={isProcessing}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50 group"
                >
                  {isProcessing ? "Traitement..." : "Virement FST Sécurisé"}
                  <Lock className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </div>

            {/* REASSURANCE */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded-xl border border-gray-50">
                <Lock className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">SSL 256-bit</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-50">
                <Check className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Garantie 2 ans</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-50">
                <Shield className="w-5 h-5 mx-auto text-rose-500 mb-1" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Flocon Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div>
            <p className="text-xs text-gray-500">Total à régler</p>
            <p className="text-xl font-bold text-gray-900">{total.toLocaleString()}€</p>
          </div>
          <button
            onClick={() => handlePayment('fst')}
            disabled={isProcessing}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm"
          >
            {isProcessing ? "..." : "Payer"}
          </button>
        </div>
      </div>

      {/* RedirectOverlay pour authentification */}
      <RedirectOverlay isVisible={isRedirectingToLogin} />
    </div>
  );
}