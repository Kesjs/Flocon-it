"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Shield, Truck, Clock, X, Eye, Package } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { CheckoutService } from "@/lib/checkout-service";
import { usePageLoader } from "@/hooks/usePageLoader";
import PageLoader from "@/components/PageLoader";
import { isValidEmail, isValidName, isValidAddress, isValidCity, isValidPostalCode, isValidPhone, validatePhoneWithMessage } from "@/lib/validation";
import { RedirectManager } from "@/lib/redirect-manager";
import { FRENCH_CITIES, filterCities } from "@/lib/french-cities";
import { formatPhoneNumber, validateFrenchPhoneNumber, getPhoneType, getPhoneExample } from "@/lib/phone-utils";
import { 
  ALL_COUNTRIES, 
  EUROPEAN_COUNTRIES, 
  filterCountries, 
  getCountryByCode, 
  getPhonePrefixByCountry, 
  DEFAULT_COUNTRY 
} from "@/lib/countries";
import { getCitiesByCountry, filterCitiesByCountry } from "@/lib/world-cities";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { isLoading } = usePageLoader();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(ALL_COUNTRIES);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: DEFAULT_COUNTRY.code
  });

  // Restaurer l'état depuis localStorage au montage
  useEffect(() => {
    console.log('🔄 Initialisation page checkout');
    try {
      const savedEmail = localStorage.getItem('checkout-email');
      const savedShowSummary = localStorage.getItem('checkout-show-summary');
      
      console.log('📧 Email sauvegardé:', savedEmail);
      console.log('📋 ShowSummary sauvegardé:', savedShowSummary);
      
      if (savedEmail) {
        setCustomerEmail(savedEmail);
      }
      if (savedShowSummary === 'true') {
        setShowSummary(true);
      }
      
      // Restaurer les données depuis l'intention de redirection si disponible
      const checkoutIntent = RedirectManager.getIntent();
      console.log('🎯 Intentions de checkout:', checkoutIntent);
      if (checkoutIntent?.type === 'checkout' && checkoutIntent.data) {
        if (checkoutIntent.data.email && !savedEmail) {
          setCustomerEmail(checkoutIntent.data.email);
        }
        if (checkoutIntent.data.shippingAddress) {
          setShippingAddress(prev => ({
            ...prev,
            ...checkoutIntent.data.shippingAddress
          }));
        }
        // Nettoyer l'intention après restauration
        RedirectManager.clearIntent();
      }
    } catch (error) {
      console.error('Erreur lors de la restauration de l\'état checkout:', error);
    }
    
    // Log de l'état final
    console.log('📊 État initial:', {
      cartItems: cartItems.length,
      customerEmail,
      shippingAddress,
      user: !!user
    });
  }, []); // Tableau vide pour n'exécuter qu'au montage

  // Sauvegarder l'état dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('checkout-email', customerEmail);
      localStorage.setItem('checkout-show-summary', showSummary.toString());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état checkout:', error);
    }
  }, [customerEmail, showSummary]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Fonction de validation stricte
  const validateForm = (): boolean => {
    console.log('🔍 Début validation formulaire');
    const errors: string[] = [];

    // Validation email
    console.log('📧 Email testé:', customerEmail);
    if (!isValidEmail(customerEmail)) {
      console.log('❌ Email invalide');
      errors.push('Email invalide : format attendu exemple@domaine.com');
    } else {
      console.log('✅ Email valide');
    }

    // Validation adresse de livraison
    console.log('👤 Nom testé:', shippingAddress.name);
    if (!isValidName(shippingAddress.name)) {
      console.log('❌ Nom invalide');
      errors.push('Nom complet invalide : 2-100 caractères, lettres uniquement');
    } else {
      console.log('✅ Nom valide');
    }
    
    console.log('🏠 Adresse testée:', shippingAddress.address);
    if (!isValidAddress(shippingAddress.address)) {
      console.log('❌ Adresse invalide');
      errors.push('Adresse invalide : 5-200 caractères requis');
    } else {
      console.log('✅ Adresse valide');
    }
    
    console.log('🏙️ Ville testée:', shippingAddress.city);
    if (!isValidCity(shippingAddress.city)) {
      console.log('❌ Ville invalide');
      errors.push('Ville invalide : 2-100 caractères, lettres uniquement');
    } else {
      console.log('✅ Ville valide');
    }
    
    console.log('📮 Code postal testé:', shippingAddress.postalCode);
    if (!isValidPostalCode(shippingAddress.postalCode)) {
      console.log('❌ Code postal invalide');
      errors.push('Code postal invalide : format français requis (ex: 75001)');
    } else {
      console.log('✅ Code postal valide');
    }
    
    console.log('📱 Téléphone testé:', shippingAddress.phone);
    const phoneValidation = validatePhoneWithMessage(shippingAddress.phone, selectedCountry.code);
    if (!phoneValidation.isValid) {
      console.log('❌ Téléphone invalide');
      errors.push(phoneValidation.message);
    } else {
      console.log('✅ Téléphone valide');
    }

    console.log(`📊 Résultat validation: ${errors.length} erreurs`, errors);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCheckout = async () => {
    console.log('🔘 Bouton "PAYER AVEC STRIPE" cliqué');
    console.log('📊 État actuel:', {
      cartItems: cartItems.length,
      customerEmail,
      user: !!user,
      isProcessing,
      showSummary
    });

    if (cartItems.length === 0) {
      console.log('❌ Panier vide - retour anticipé');
      alert('Votre panier est vide');
      return;
    }
    
    // Validation stricte du formulaire
    console.log('🔍 Début validation formulaire');
    if (!validateForm()) {
      console.log('❌ Validation formulaire échouée - retour anticipé');
      return;
    }
    console.log('✅ Validation formulaire réussie');

    // Vérifier si l'utilisateur est connecté
    if (!user) {
      console.log('❌ Utilisateur non connecté - sauvegarde intention et redirection');
      // Sauvegarder l'intention de checkout avec les données du formulaire
      RedirectManager.setCheckoutIntent({
        email: customerEmail,
        shippingAddress: shippingAddress
      });
      
      alert('Veuillez vous connecter pour finaliser votre commande');
      router.push('/login');
      return;
    }
    console.log('✅ Utilisateur connecté:', user.email);

    console.log('🚀 Début du traitement Stripe');
    setIsProcessing(true);
    console.log('🚀 Début du paiement:', { cartItems: cartItems.length, customerEmail });

    try {
      // Option 1: Payer avec Stripe (garder l'existant)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          customerEmail,
          shippingAddress
        }),
      });

      console.log('📡 Réponse API:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API:', errorText);
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Données reçues:', data);

      const { sessionId, url } = data;

      if (url) {
        console.log('🔄 Redirection vers:', url);
        // Rediriger vers Stripe Checkout
        window.location.href = url;
      } else {
        console.error('❌ URL manquante dans la réponse:', data);
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('💥 Erreur lors du paiement:', error);
      alert('Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Nouvelle fonction pour paiement simulé (créer commande directement)
  const handleSimulatedPayment = async () => {
    console.log('🔘 Bouton "Payer" cliqué');
    if (cartItems.length === 0) {
      console.log('❌ Panier vide');
      return;
    }
    
    // Validation stricte du formulaire
    if (!validateForm()) {
      console.log('❌ Validation formulaire échouée');
      return;
    }
    
    if (!user) {
      console.log('❌ Utilisateur non connecté');
      // Sauvegarder l'intention de checkout avec les données du formulaire
      RedirectManager.setCheckoutIntent({
        email: customerEmail,
        shippingAddress: shippingAddress
      });
      
      alert('Veuillez vous connecter pour finaliser votre commande');
      router.push('/login');
      return;
    }

    console.log('✅ Début du traitement paiement simulé');
    setIsProcessing(true);

    try {
      const result = await CheckoutService.processPayment(
        user.id,
        cartItems,
        shippingAddress,
        'card'
      );

      if (result.success) {
        // Vider le panier après paiement réussi
        clearCart();
        
        // Afficher un message de succès stylisé
        setSuccessMessage(`🎉 ${result.message}\nNuméro de commande: ${result.orderId}`);
        
        // Rediriger après un court délai pour montrer le succès
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setValidationErrors([result.message]);
      }
    } catch (error) {
      console.error('💥 Erreur lors du paiement simulé:', error);
      alert('Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  const handleProceedToPayment = () => {
    console.log('🔘 Bouton "Voir le résumé et payer" cliqué');
    // Validation stricte avant de passer au résumé
    if (!validateForm()) {
      console.log('❌ Validation formulaire échouée pour résumé');
      return;
    }
    console.log('✅ Validation réussie, affichage du résumé');
    setShowSummary(true);
  };

  // Sauvegarder l'adresse de livraison dans localStorage pour la synchronisation
  useEffect(() => {
    if (shippingAddress.name || shippingAddress.address || shippingAddress.city) {
      localStorage.setItem('checkout-shipping-address', JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);
  useEffect(() => {
    if (showSummary) {
      setShowSummary(false);
      console.log('🔄 Forcer affichage du formulaire au démarrage');
    }
  }, []);

  // Gérer la recherche de pays
  const handleCountrySearch = (searchTerm: string) => {
    setCountrySearchTerm(searchTerm);
    
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
    setShippingAddress(prev => ({
      ...prev,
      country: country.code
    }));
    setCountrySearchTerm(`${country.flag} ${country.name}`);
    setShowCountryDropdown(false);
    setFilteredCountries([]);
    
    // Réinitialiser la ville quand on change de pays
    setCitySearchTerm('');
    setShippingAddress(prev => ({
      ...prev,
      city: ''
    }));
  };

  // Gérer la recherche de villes (par pays)
  const handleCitySearch = (searchTerm: string) => {
    setCitySearchTerm(searchTerm);
    setShippingAddress(prev => ({
      ...prev,
      city: searchTerm
    }));
    
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
    setShippingAddress(prev => ({
      ...prev,
      city
    }));
    setCitySearchTerm(city);
    setShowCityDropdown(false);
    setFilteredCities([]);
  };

  // Gérer la saisie du téléphone
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setShippingAddress({...shippingAddress, phone: formatted});
  };

  // Gérer le clic extérieur pour fermer les dropdowns
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

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Nettoyer l'état checkout après paiement réussi
  const clearCheckoutState = () => {
    try {
      localStorage.removeItem('checkout-email');
      localStorage.removeItem('checkout-show-summary');
    } catch (error) {
      console.error('Erreur lors du nettoyage de l\'état checkout:', error);
    }
  };

  
  if (isComplete) {
    return (
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-textDark mb-4">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
          </p>
          <Link
            href="/"
            className="inline-block bg-textDark text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-display font-bold text-textDark mb-4">
            Votre panier est vide
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuer vos achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <div className="pt-28 min-h-screen bg-cream px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>

          {!showSummary ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h1 className="text-3xl font-display font-bold text-textDark mb-6">
              Finaliser ma commande
            </h1>
            
            {/* Informations essentielles */}
            <div className="space-y-6">
              {/* Message de succès */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 Paiement réussi !</h4>
                  <p className="text-green-700 text-sm whitespace-pre-line">{successMessage}</p>
                  <p className="text-green-600 text-xs mt-2">Redirection vers votre dashboard...</p>
                </div>
              )}

              {/* Affichage des erreurs de validation */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Erreurs de validation :</h4>
                  <ul className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-red-700 text-sm">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-textDark mb-2">
                  Email pour la confirmation
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous recevrez la confirmation de commande et les détails de suivi à cette adresse
                </p>
              </div>

              {/* Adresse de livraison */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-textDark mb-3">Adresse de livraison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      placeholder="Jean Dupont"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none bg-gray-50 hover:bg-gray-100 transition-colors min-w-[100px] flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span>{selectedCountry.flag}</span>
                            <span className="text-sm">{selectedCountry.phoneCode}</span>
                          </span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showCountryDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {ALL_COUNTRIES.map((country, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-rose-custom/10 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                              >
                                <span>{country.flag}</span>
                                <div>
                                  <div className="font-medium text-sm">{country.name}</div>
                                  <div className="text-xs text-gray-500">{country.phoneCode}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 relative">
                        <input
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder={`${selectedCountry.phoneCode} 6 12 34 56 78`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                          required
                        />
                        {shippingAddress.phone && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {getPhoneType(shippingAddress.phone) === 'mobile' ? (
                              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center" title="Mobile">
                                <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                              </div>
                            ) : getPhoneType(shippingAddress.phone) === 'fixe' ? (
                              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center" title="Fixe">
                                <svg className="w-2 h-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: {selectedCountry.phoneCode} • Mobile/Fixe • International
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      placeholder="123 Rue de la Paix"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <div className="country-search-container relative">
                      <input
                        type="text"
                        value={countrySearchTerm || `${selectedCountry.flag} ${selectedCountry.name}`}
                        onChange={(e) => handleCountrySearch(e.target.value)}
                        onFocus={() => {
                          if (countrySearchTerm.length >= 2) {
                            const countries = filterCountries(countrySearchTerm);
                            setFilteredCountries(countries);
                            setShowCountryDropdown(countries.length > 0);
                          } else {
                            setFilteredCountries(ALL_COUNTRIES);
                            setShowCountryDropdown(true);
                          }
                        }}
                        placeholder="Rechercher un pays..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                        required
                        autoComplete="off"
                      />
                      
                      {showCountryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredCountries.map((country, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectCountry(country)}
                              className="w-full px-3 py-2 text-left hover:bg-rose-custom/10 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div>
                                <div className="font-medium">{country.name}</div>
                                <div className="text-xs text-gray-500">{country.phoneCode} • {country.currency}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <div className="city-search-container relative">
                      <input
                        type="text"
                        value={citySearchTerm || shippingAddress.city}
                        onChange={(e) => handleCitySearch(e.target.value)}
                        onFocus={() => {
                          if (citySearchTerm.length >= 2) {
                            const cities = filterCitiesByCountry(selectedCountry.code, citySearchTerm);
                            setFilteredCities(cities);
                            setShowCityDropdown(cities.length > 0);
                          }
                        }}
                        placeholder={`Ville en ${selectedCountry.name}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                        required
                        autoComplete="off"
                      />
                      
                      {showCityDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredCities.map((city, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectCity(city)}
                              className="w-full px-3 py-2 text-left hover:bg-rose-custom/10 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                      placeholder="75001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Résumé simplifié */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="text-2xl font-bold text-rose-custom">{total.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Voir le résumé et payer
              </button>
              
              {customerEmail && (
                <button
                  onClick={() => {
                    setCustomerEmail('');
                    setShowSummary(false);
                    clearCheckoutState();
                  }}
                  className="w-full text-center text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Réinitialiser le formulaire
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Résumé détaillé */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-display font-bold text-textDark mb-4">
                  Résumé de votre commande
                </h2>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="relative group">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image && !imageErrors.has(item.id) ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(item.id)}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">Photo</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleQuickView(item)}
                          className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-6 h-6 text-white" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-textDark">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-custom">
                          {(item.price * item.quantity).toFixed(2)} €
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.price.toFixed(2)} € / unité
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-textDark">Total</div>
                      <div className="text-sm text-gray-600">TVA incluse</div>
                    </div>
                    <div className="text-2xl font-bold text-rose-custom">{total.toFixed(2)} €</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-textDark mb-4">Email de confirmation</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium">{customerEmail}</p>
                  <p className="text-sm text-gray-600">Vous recevrez la confirmation à cette adresse</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-textDark mb-4">Adresse de livraison</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>{shippingAddress.name}</strong></p>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                  <p>{shippingAddress.phone}</p>
                </div>
                
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-full text-center text-rose-custom hover:underline text-sm font-medium mt-4"
                >
                  Modifier mes informations
                </button>
              </div>
            </div>

            {/* Paiement */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-textDark mb-4">Finalisation de la commande</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Commande 100% sécurisée</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>Préparation de votre commande</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-purple-600" />
                    <span>Livraison en France métropolitaine</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-4 rounded-xl font-black hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border-2 border-black"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6" />
                        <span className="text-lg">PAYER</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleSimulatedPayment}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-6 h-6" />
                        <span className="text-lg">PAYER</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal aperçu rapide du produit */}
      {showProductModal && selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeProductModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-textDark">{selectedProduct.name}</h2>
                <button
                  onClick={closeProductModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {selectedProduct.image && !imageErrors.has(selectedProduct.id) ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(selectedProduct.id)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Image non disponible</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-rose-custom">{selectedProduct.price.toFixed(2)} €</p>
                    <p className="text-sm text-gray-600">Prix unitaire</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-textDark mb-2">Description</h3>
                    <p className="text-gray-600">
                      {selectedProduct.description || 'Produit de qualité supérieure, parfait pour vos besoins. Fabriqué avec des matériaux premium pour une durabilité exceptionnelle.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-textDark mb-2">Dans votre panier</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quantité:</span>
                        <span className="font-semibold">{selectedProduct.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-lg text-rose-custom">
                          {(selectedProduct.price * selectedProduct.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={closeProductModal}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Fermer
                    </button>
                    <Link
                      href={`/boutique`}
                      onClick={closeProductModal}
                      className="flex-1 bg-rose-custom text-white py-2 rounded-lg font-medium hover:bg-rose-custom/90 transition-colors text-center"
                    >
                      Voir la boutique
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </div>
    </>
  );
}
