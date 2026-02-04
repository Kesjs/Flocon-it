"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Shield, Truck, Clock, X, Eye, Package, Building } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { CheckoutService } from "@/lib/checkout-service";
import { isValidEmail, isValidName, isValidAddress, isValidCity, isValidPostalCode, isValidPhone, validatePhoneWithMessage } from "@/lib/validation";
import { RedirectManager } from "@/lib/redirect-manager";
import { FRENCH_CITIES, filterCities } from "@/lib/french-cities";
import { formatPhoneNumber, validateFrenchPhoneNumber, getPhoneType, getPhoneExample } from "@/lib/phone-utils";
import { useNProgress } from "@/hooks/useNProgress";
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
  const { start: startProgress, done: doneProgress } = useNProgress();
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('fst');
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

  const handleFSTPayment = async () => {
    console.log('🏦 Début du traitement Flocon Secure Transfer');
    
    if (!validateForm()) {
      console.log('❌ Validation formulaire échouée pour FST');
      return;
    }

    setIsProcessing(true);
    startProgress(); // Démarrer NProgress

    try {
      // Créer la commande pour FST
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customerEmail,
          shippingAddress,
          payment_method: 'fst',
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur création commande FST');
      }

      const order = await response.json();
      
      // Rediriger vers la page FST avec router natif
      console.log('🔄 Redirection vers FST (router natif)');
      router.push(`/checkout/fst?order_id=${order.id}`);
      
    } catch (error) {
      console.error('💥 Erreur FST:', error);
      setValidationErrors(['Erreur lors de la préparation du virement sécurisé']);
      setIsProcessing(false);
      doneProgress(); // Arrêter NProgress en cas d'erreur
    }
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
    startProgress(); // Démarrer NProgress
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
          metadata: {
            userId: user.id,
            // Ajouter les métadonnées d'adresse
            shippingName: shippingAddress.name || customerEmail,
            shippingAddress: shippingAddress.address || 'Adresse non spécifiée',
            shippingCity: shippingAddress.city || 'Paris',
            shippingPostalCode: shippingAddress.postalCode || '75001',
            shippingPhone: shippingAddress.phone || '+33 6 00 00 00 00',
            shippingCountry: shippingAddress.country || 'FR',
            // Sauvegarder les items du panier pour le reçu
            cartItems: JSON.stringify(cartItems)
          },
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
      doneProgress(); // Arrêter NProgress
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
      doneProgress(); // Arrêter NProgress
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
  // Forcer l'affichage du formulaire au démarrage
  useEffect(() => {
    setShowSummary(false);
    console.log('🔄 Forcer affichage du formulaire au démarrage');
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
      <div className="pt-32 min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Header institutionnel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 shadow-lg">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Commande Confirmée
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Merci pour votre confiance. Votre commande a été enregistrée avec succès.
            </p>
          </motion.div>

          {/* Carte principale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* En-tête de la carte */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Récapitulatif</h2>
                  <p className="text-emerald-100 mt-1">Commande #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white font-semibold">Validée</span>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-8 space-y-8">
              {/* Section email */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email de confirmation</h3>
                    <p className="text-gray-600 mb-3">
                      Un email détaillé a été envoyé à votre adresse email. Il contient toutes les informations relatives à votre commande.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-500">Adresse de destination</p>
                      <p className="font-medium text-gray-900">{customerEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section livraison */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Préparation & Expédition</h3>
                    <p className="text-gray-600 mb-3">
                      Votre commande est maintenant en préparation. Vous recevrez une notification dès l'expédition.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Commande confirmée</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span>En préparation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <span>Expédiée</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section sécurité */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Garantie & Sécurité</h3>
                    <p className="text-gray-600">
                      Votre transaction est sécurisée et protégée. Conservez cet email comme preuve d'achat et garantie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Continuer vos achats
            </Link>
            
            <Link
              href="/dashboard"
              className="flex-1 bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon compte
            </Link>
          </motion.div>

          {/* Footer institutionnel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500 mb-4">
              Merci d'avoir choisi Flocon Market
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>© 2026 Flocon Market</span>
              <span>•</span>
              <span>SIRET: 123 456 789</span>
              <span>•</span>
              <span>France</span>
            </div>
          </motion.div>
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
      <div className="pt-28 min-h-screen bg-cream px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>

          {/* Formulaire de paiement - maintenant visible par défaut */}

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
                  <p className="text-green-7 00 text-sm whitespace-pre-line">{successMessage}</p>
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
                className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors flex items-center justify-center gap-2 text-base"
              >
                <CreditCard className="w-4 h-4" />
                Commander
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
  className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
>
  <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8">
    
    {/* SECTION GAUCHE : RÉCAPITULATIF & INFOS (3/5) */}
    <div className="w-full lg:col-span-3 space-y-6">
      
      {/* 1. Le Panier Style "Ticket" */}
      <section className="w-full">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 justify-center lg:justify-start">
          <span className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs">1</span>
          Résumé de la commande
        </h2>
        
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
            {cartItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image && !imageErrors.has(item.id) ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 uppercase text-center px-1">Photo</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)}€</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50/50 p-4 border-t border-gray-100">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm text-gray-600 font-medium">Total TTC</span>
              <span className="text-xl font-black text-rose-600">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Infos Livraison & Contact (Grid 2 col sur tablette/PC) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center md:text-left">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Livraison</h3>
          <div className="text-sm text-gray-700 space-y-0.5">
            <p className="font-bold text-gray-900 truncate leading-tight">{shippingAddress.name}</p>
            <p className="truncate">{shippingAddress.address}</p>
            <p>{shippingAddress.postalCode}, {shippingAddress.city}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center md:text-left flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Contact</h3>
            <p className="text-sm font-bold text-gray-900 truncate">{customerEmail}</p>
          </div>
          <button 
            onClick={() => setShowSummary(false)}
            className="mt-3 text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            Modifier les informations
          </button>
        </div>
      </section>
    </div>

    {/* SECTION DROITE : PAIEMENT (2/5) */}
    <div className="w-full lg:col-span-2">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-5 sm:p-6 lg:p-8 sticky top-8 text-center lg:text-left">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 justify-center lg:justify-start">
          <span className="w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
          Paiement
        </h2>

        {/* Options de Paiement */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedPaymentMethod('fst')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              selectedPaymentMethod === 'fst' 
                ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`p-2.5 rounded-lg shrink-0 ${selectedPaymentMethod === 'fst' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Building size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-[13px] truncate">Virement Flocon</p>
              <p className="text-[11px] text-emerald-600 font-medium">Instantané • 0€ frais</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedPaymentMethod('card')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              selectedPaymentMethod === 'card' 
                ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`p-2.5 rounded-lg shrink-0 ${selectedPaymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <CreditCard size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-[13px] truncate">Carte Bancaire</p>
              <p className="text-[11px] text-gray-500 font-medium">Visa / Master / Stripe</p>
            </div>
          </button>
        </div>

        {/* Bouton d'action */}
        <button
          onClick={selectedPaymentMethod === 'fst' ? handleFSTPayment : handleCheckout}
          disabled={isProcessing}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-base hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>
                {selectedPaymentMethod === 'fst' ? 'Préparation du virement...' : 'Redirection Stripe...'}
              </span>
            </>
          ) : (
            <>
              {selectedPaymentMethod === 'fst' ? (
                <>
                  <Building className="w-5 h-5" />
                  <span>PAYER PAR VIREMENT</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>PAYER AVEC STRIPE</span>
                </>
              )}
            </>
          )}
        </button>

        {/* Pied de carte paiement */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mb-4">
            <Shield size={12} className="text-green-500" /> Sécurisation SSL 256-bits
          </div>
          
          <label className="inline-flex items-center justify-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
            <span className="text-[11px] text-gray-500 group-hover:text-gray-700 transition-colors">S'inscrire aux offres exclusives</span>
          </label>
        </div>
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
