"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Check, CreditCard, Shield, Truck, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CheckoutService } from "@/lib/checkout-service";
import { loadStripe } from "@stripe/stripe-js";
import { isValidEmail, isValidName, isValidAddress, isValidCity, isValidPostalCode, isValidPhone } from "@/lib/validation";
import { RedirectManager } from "@/lib/redirect-manager";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fonction de validation stricte
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Validation email
    if (!isValidEmail(customerEmail)) {
      errors.push('Email invalide : format attendu exemple@domaine.com');
    }

    // Validation adresse de livraison
    if (!isValidName(shippingAddress.name)) {
      errors.push('Nom complet invalide : 2-100 caractères, lettres uniquement');
    }
    if (!isValidAddress(shippingAddress.address)) {
      errors.push('Adresse invalide : 5-200 caractères requis');
    }
    if (!isValidCity(shippingAddress.city)) {
      errors.push('Ville invalide : 2-100 caractères, lettres uniquement');
    }
    if (!isValidPostalCode(shippingAddress.postalCode)) {
      errors.push('Code postal invalide : 5 chiffres requis (ex: 75001)');
    }
    if (!isValidPhone(shippingAddress.phone)) {
      errors.push('Téléphone invalide : format français requis (ex: +33 6 12 34 56 78)');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Réinitialiser l'email quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && user?.email) {
      setCustomerEmail(user.email);
    }
    
    // Restaurer les données depuis l'intention de redirection si disponible
    if (isOpen) {
      const checkoutIntent = RedirectManager.getIntent();
      if (checkoutIntent?.type === 'checkout' && checkoutIntent.data) {
        if (checkoutIntent.data.email && !customerEmail) {
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
    }
  }, [isOpen, user, customerEmail]);

  
  const handleStripeCheckout = async () => {
    if (cartItems.length === 0) return;
    
    // Validation stricte du formulaire
    if (!validateForm()) {
      return;
    }

    if (!user) {
      // Sauvegarder l'intention de checkout avec les données du formulaire
      RedirectManager.setCheckoutIntent({
        email: customerEmail,
        shippingAddress: shippingAddress
      });
      
      alert('Veuillez vous connecter pour finaliser votre commande');
      return;
    }

    setIsProcessing(true);

    try {
      // Créer la session Stripe avec les métadonnées pour le webhook
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
            // Ajouter les métadonnées d'adresse si disponibles
            shippingName: shippingAddress.name || customerEmail,
            shippingAddress: shippingAddress.address || 'Adresse non spécifiée',
            shippingCity: shippingAddress.city || 'Paris',
            shippingPostalCode: shippingAddress.postalCode || '75001',
            shippingPhone: shippingAddress.phone || '+33 6 00 00 00 00'
          },
          shippingAddress
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const { url } = data;

      if (url) {
        // Fermer le modal et ouvrir Stripe dans la même fenêtre
        onClose();
        window.location.href = url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Erreur lors du paiement Stripe:', error);
      alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  const handleSimulatedPayment = async () => {
    if (cartItems.length === 0) return;
    
    // Validation stricte du formulaire
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      // Sauvegarder l'intention de checkout avec les données du formulaire
      RedirectManager.setCheckoutIntent({
        email: customerEmail,
        shippingAddress: shippingAddress
      });
      
      alert('Veuillez vous connecter pour finaliser votre commande');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🛒 Début paiement:', { userId: user.id, cartItems: cartItems.length, shippingAddress });
      
      const result = await CheckoutService.processPayment(
        user.id,
        cartItems,
        shippingAddress,
        'card'
      );

      console.log('✅ Début du traitement paiement');

      if (result.success) {
        console.log('✅ Paiement réussi, vidage du panier...');
        clearCart();
        console.log('🧹 Panier vidé');
        
        // Afficher le message de succès
        setSuccessMessage(`🎉 ${result.message}\nNuméro de commande: ${result.orderId}`);
        
        setIsComplete(true);
        
        setTimeout(() => {
          console.log('🔄 Redirection vers dashboard...');
          onClose();
          // Rediriger vers dashboard après succès
          window.location.href = '/dashboard';
        }, 3000);
      } else {
        console.error('❌ Échec paiement:', result.message);
        setValidationErrors([result.message]);
      }
    } catch (error) {
      console.error('💥 Erreur lors du paiement:', error);
      alert('Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-textDark">
              Finaliser ma commande
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isComplete ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-textDark mb-2">
                  Commande confirmée !
                </h3>
                <p className="text-gray-600 mb-4">
                  Merci pour votre achat. Redirection vers votre dashboard...
                </p>
              </div>
            ) : !showSummary ? (
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

                {/* Email */}
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
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                        required
                      />
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        placeholder="Paris"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                        required
                      />
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

                {/* Résumé */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</span>
                    <span className="text-2xl font-bold text-rose-custom">{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleStripeCheckout}
                    disabled={isProcessing}
                    className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Paiement en cours...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Payer avec Stripe
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSimulatedPayment}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Payer
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Résumé détaillé - pourrait être ajouté ici */}
                <div className="text-center">
                  <p>Résumé de la commande...</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
