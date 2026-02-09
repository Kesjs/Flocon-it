"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Shield, Truck, Clock, X, Eye } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Restaurer l'état depuis localStorage au montage
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('checkout-email');
      const savedShowSummary = localStorage.getItem('checkout-show-summary');
      
      if (savedEmail) {
        setCustomerEmail(savedEmail);
      }
      if (savedShowSummary === 'true') {
        setShowSummary(true);
      }
    } catch (error) {
      console.error('Erreur lors de la restauration de l\'état checkout:', error);
    }
  }, []);

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

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    if (!customerEmail || !customerEmail.includes('@')) {
      alert('Per favore inserisci un indirizzo email valido');
      return;
    }

    setIsProcessing(true);
    console.log('🚀 Début du paiement:', { cartItems: cartItems.length, customerEmail });

    try {
      // Créer la session Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          customerEmail,
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
      alert('Si è verificato un errore durante l\'elaborazione del pagamento. Riprova.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToPayment = () => {
    if (customerEmail && customerEmail.includes('@')) {
      setShowSummary(true);
    } else {
      alert('Per favore inserisci un indirizzo email valido');
    }
  };

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
            Ordine confermato!
          </h1>
          <p className="text-gray-600 mb-6">
            Grazie per il tuo acquisto. Riceverai un'email di conferma a breve.
          </p>
          <Link
            href="/"
            className="inline-block bg-textDark text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Torna alla home
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
            Il tuo carrello è vuoto
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Continua i tuoi acquisti
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rose-custom hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna al negozio
        </Link>

        {!showSummary ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h1 className="text-3xl font-display font-bold text-textDark mb-6">
              Finalizza il mio ordine
            </h1>
            
            {/* Informations essentielles */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-textDark mb-2">
                  Email per la conferma
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
                  Riceverai la conferma dell'ordine e i dettagli di tracking a questo indirizzo
                </p>
              </div>

              {/* Informations sur le paiement */}
              <div className="bg-gradient-to-r from-rose-custom-50 to-iceBlue-50 rounded-lg p-4">
                <h3 className="font-semibold text-textDark mb-3">Informazioni di spedizione e pagamento</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Le tue informazioni di spedizione e pagamento saranno raccolte in modo sicuro tramite Stripe Checkout.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Pagamento sicuro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Spedizione gratuita</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">Spedizione rapida</span>
                  </div>
                </div>
              </div>

              {/* Résumé simplifié */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Totale ({cartItems.length} articolo{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="text-2xl font-bold text-rose-custom">{total.toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Vedi il riepilogo e paga
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
                  Resetta il modulo
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
                  Riepilogo del tuo ordine
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
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Si l'image ne se charge pas, la cacher et montrer le fallback
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"><span class="text-gray-500">Immagine non disponibile</span></div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">Foto</span>
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
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-textDark truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.description || 'Prodotto di qualità'}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">Quantità: {item.quantity}</span>
                          <span className="text-sm font-medium text-rose-custom">{item.price.toFixed(2)} €/pezzo</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-lg text-textDark">
                          {(item.price * item.quantity).toFixed(2)} €
                        </div>
                        <button
                          onClick={() => handleQuickView(item)}
                          className="text-xs text-rose-custom hover:underline flex items-center gap-1 mt-1"
                        >
                          <Eye className="w-3 h-3" />
                          Vedi
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-textDark">Total</div>
                      <div className="text-sm text-gray-600">IVA inclusa</div>
                    </div>
                    <div className="text-2xl font-bold text-rose-custom">{total.toFixed(2)} €</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-textDark mb-3">Email di conferma</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium">{customerEmail}</p>
                  <p className="text-sm text-gray-600">Riceverai la conferma a questo indirizzo</p>
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-textDark mb-4">Pagamento sicuro</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Pagamento 100% sicuro</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Carta di credito, PayPal...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-purple-600" />
                    <span>Spedizione in Italia</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Pagamento in corso...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Paga
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Sarai reindirizzato a Stripe Checkout per finalizzare il pagamento
                </p>
              </div>

              <button
                onClick={() => setShowSummary(false)}
                className="w-full text-center text-rose-custom hover:underline text-sm font-medium"
              >
                Modifica le mie informazioni
              </button>
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
                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Si l'image ne se charge pas, la cacher et montrer le fallback
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center"><span class="text-gray-500">Image non disponible</span></div>';
                        }
                      }}
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
                    <p className="text-sm text-gray-600">Prezzo unitario</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-textDark mb-2">Descrizione</h3>
                    <p className="text-gray-600">
                      {selectedProduct.description || 'Prodotto di alta qualità, perfetto per le tue esigenze. Realizzato con materiali premium per una durata eccezionale.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-textDark mb-2">Nel tuo carrello</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quantità:</span>
                        <span className="font-semibold">{selectedProduct.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Totale:</span>
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
                      Chiudi
                    </button>
                    <Link
                      href={`/boutique`}
                      onClick={closeProductModal}
                      className="flex-1 bg-rose-custom text-white py-2 rounded-lg font-medium hover:bg-rose-custom/90 transition-colors text-center"
                    >
                      Vedi il negozio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
