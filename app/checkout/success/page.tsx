"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { OrderStorage } from "@/lib/order-storage";
import { useCart } from "@/context/CartContext";
import { syncStripeOrder } from "@/lib/order-sync";
import Head from "next/head";

// Meta component pour empêcher le cache
function CacheControl() {
  useEffect(() => {
    // Forcer le rechargement si c'est une version en cache
    if (typeof window !== 'undefined') {
      const version = '2025-01-01-v4'; // Version mise à jour pour FST
      const currentVersion = sessionStorage.getItem('checkout-success-version');
      
      if (currentVersion !== version) {
        sessionStorage.setItem('checkout-success-version', version);
        window.location.reload();
      }
    }
  }, []);
  
  return (
    <Head>
      <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta name="pragma" content="no-cache" />
      <meta name="expires" content="0" />
    </Head>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // VIDAGE SYSTÉMATIQUE DU PANIER DÈS L'ARRIVÉE SUR LA PAGE
    clearCart();
    
    // Forcer le nettoyage de tout localStorage résiduel
    try {
      localStorage.removeItem('cart-cleared-notification');
      localStorage.removeItem('checkout-cart-cleared');
    } catch (error) {
    }
    
    if (!sessionId) {
      // Pas de session_id - rediriger vers la page checkout ou accueil
      const timer = setTimeout(() => {
        router.push('/checkout');
      }, 3000); // Attendre 3 secondes avant la redirection

      return () => clearTimeout(timer);
    }

    // Attendre que l'utilisateur soit chargé
    if (authLoading) {
      return;
    }

    
    // Récupérer les vraies données de la session Stripe et créer la commande
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/get-session?session_id=${sessionId}`);
        const data = await response.json();


        if (response.ok && data.orderDetails) {
          setOrderDetails(data.orderDetails);
          
          // Créer la commande dans localStorage si l'utilisateur est connecté
          
          if (user && data.orderDetails.items) {
            
            // Vérifier si une commande avec cet ID de session existe déjà
            const existingOrders = OrderStorage.getUserOrders(user.id);
            const existingOrder = existingOrders.find(order => 
              order.id.includes(sessionId) || 
              (order.total === data.orderDetails.total && 
               order.items === data.orderDetails.items.reduce((sum: number, item: any) => sum + item.quantity, 0) &&
               Math.abs(new Date(order.date).getTime() - Date.now()) < 300000) // Commande dans les 5 dernières minutes
            );
            
            if (existingOrder) {
              return; // Ne pas créer de doublon
            }
            
            
            const orderProducts = data.orderDetails.items.map((item: any) => ({
              id: item.id || 'unknown',
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image || '/logof.jpg'
            }));


            try {
              const order = OrderStorage.addOrder({
                userId: user.id,
                status: 'En préparation', // Statut temporaire, sera mis à jour par le webhook
                total: data.orderDetails.total,
                items: data.orderDetails.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
                products: orderProducts,
                shippingAddress: {
                  name: data.orderDetails.email || 'Client',
                  address: 'En attente de confirmation webhook',
                  city: 'En attente de confirmation webhook',
                  postalCode: '00000',
                  phone: 'En attente de confirmation webhook'
                }
              });

              
              // Tenter une synchronisation immédiate avec les données du formulaire
              const formData = localStorage.getItem('checkout-shipping-address');
              if (formData) {
                try {
                  const shippingData = JSON.parse(formData);
                  
                  // const syncResult = syncStripeOrder({
//                     sessionId: sessionId,
//                     customerEmail: data.orderDetails.email || user.email || '',
//                     total: data.orderDetails.total,
//                     items: data.orderDetails.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
//                     shippingAddress: {
//                       name: shippingData.name || data.orderDetails.email || 'Client',
//                       address: shippingData.address || 'Adresse confirmée',
//                       city: shippingData.city || 'Ville confirmée',
//                       postalCode: shippingData.postalCode || '00000',
//                       phone: shippingData.phone || 'Téléphone confirmé',
//                       country: shippingData.country || 'FR'
//                     }
//                   }, user.id || 'anonymous');
                  
                } catch (formError) {
                }
              }
              
              // Le panier est déjà vidé au début du useEffect - pas besoin de le revider
            } catch (error) {
            }
          } else {
          }
        } else {
          // En cas d'erreur, afficher des données par défaut
          setOrderDetails({
            id: sessionId,
            status: 'Payée',
            email: 'Non disponible',
            total: 0,
          });
        }
      } catch (error) {
        // En cas d'erreur, afficher des données par défaut
        setOrderDetails({
          id: sessionId,
          status: 'Payée',
          email: 'Non disponible',
          total: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, user, authLoading, router]);

  if (isLoading && !sessionId) {
    return (
      <div className="pt-28 min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-textDark mb-4">
            Accès non valide
          </h1>
          <p className="text-gray-600 mb-4">
            Cette page n'est accessible qu'après un paiement réussi.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Vous serez redirigé vers la page de paiement dans 3 secondes...
          </p>
          <Link
            href="/checkout"
            className="inline-block bg-rose-custom text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-custom/90 transition-colors"
          >
            Retour au paiement
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de votre commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Icône de succès animée */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-black"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-display font-black text-textDark mb-4"
          >
            Paiement réussi !
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Merci pour votre commande. Vous recevrez un email de confirmation sous peu avec les détails de livraison.
          </motion.p>
          
          {/* Détails de la commande */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-xl p-6 mb-8 text-left"
          >
            <h2 className="font-semibold text-textDark mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-custom rounded-full"></div>
              Détails de la commande
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 flex-shrink-0">Numéro de commande:</span>
                <div className="text-right ml-2">
                  <span className="font-mono font-medium text-rose-custom block">
                    {orderDetails?.id ? `CMD-${orderDetails.id.substring(0, 8).toUpperCase()}` : 'N/A'}
                  </span>
                  <span className="text-xs text-gray-500 block font-mono" style={{wordBreak: 'break-all', maxWidth: '200px'}}>
                    {orderDetails?.id}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-gray-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Statut:
                </span>
                <span className="font-medium text-green-600">
                  {orderDetails?.status}
                </span>
              </div>
              
              <div className="flex justify-between items-start py-2 border-t border-gray-200">
                <span className="text-gray-600 flex-shrink-0">Email de confirmation:</span>
                <span className="font-medium text-right break-all ml-2 text-blue-600" style={{wordBreak: 'break-all', maxWidth: '200px'}}>
                  {orderDetails?.email}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-xl text-rose-custom">{orderDetails?.total?.toFixed(2)} €</span>
              </div>
              
              {orderDetails?.items && orderDetails.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-3 font-medium">Articles commandés:</p>
                  <div className="space-y-2 bg-white rounded-lg p-3">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-1 mr-2">
                          <span className="font-medium text-textDark">{item.name}</span>
                          <span className="text-gray-500 ml-2">×{item.quantity}</span>
                        </div>
                        <span className="font-semibold text-rose-custom flex-shrink-0">
                          {item.price.toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/dashboard"
              className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 border-2 border-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Voir mes commandes</span>
            </Link>
            
            <Link
              href="/boutique"
              className="flex-1 bg-white border-2 border-black text-black px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continuer mes achats</span>
            </Link>
          </motion.div>
          
          {/* Info supplémentaire */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-500 mt-6"
          >
            Un email de confirmation a été envoyé à votre adresse email.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <>
      <CacheControl />
      <Suspense fallback={
        <div className="pt-28 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </>
  );
}
