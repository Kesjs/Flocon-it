"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowLeft, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { OrderStorage } from "@/lib/order-storage";
import { syncStripeOrder } from "@/lib/order-sync";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('ID de session manquant');
      setLoading(false);
      return;
    }

    const processSuccess = async () => {
      try {
        console.log('Traitement succès paiement:', sessionId);
        
        // Récupérer les détails de la session
        const response = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Impossible de récupérer les détails de la session');
        }

        const session = await response.json();
        console.log('📋 Détails session:', session);

        // Synchroniser la commande
        if (user && session.metadata?.userId) {
          await syncStripeOrder({
            sessionId,
            customerEmail: session.customer_details?.email || '',
            total: session.amount_total / 100,
            items: parseInt(session.metadata?.itemCount || '1'),
            shippingAddress: {
              name: session.metadata?.shippingName || 'Client',
              address: session.metadata?.shippingAddress || 'Adresse non spécifiée',
              city: session.metadata?.shippingCity || 'Paris',
              postalCode: session.metadata?.shippingPostalCode || '75001',
              phone: session.metadata?.shippingPhone || '+33 6 00 00 00 00',
              country: session.metadata?.shippingCountry || 'FR'
            }
          }, user.id);
        }

        // Vider le panier
        clearCart();

        // Sauvegarder dans OrderStorage
        OrderStorage.addOrder({
          userId: user?.id || 'guest',
          status: 'En préparation',
          total: session.amount_total / 100,
          items: parseInt(session.metadata?.itemCount || '1'),
          products: [], // Sera rempli depuis les métadonnées si nécessaire
          shippingAddress: {
            name: session.metadata?.shippingName || 'Client',
            address: session.metadata?.shippingAddress || 'Adresse non spécifiée',
            city: session.metadata?.shippingCity || 'Paris',
            postalCode: session.metadata?.shippingPostalCode || '75001',
            phone: session.metadata?.shippingPhone || '+33 6 00 00 00 00'
          }
        });

        setOrderDetails(session);
        setLoading(false);

      } catch (err) {
        console.error('❌ Erreur traitement succès:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setLoading(false);
      }
    };

    processSuccess();
  }, [sessionId, user, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
        />
        <p className="ml-4 text-lg font-medium text-emerald-700">Finalisation de votre commande...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur de traitement</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              Retour au paiement
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Accueil
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            🎉 Paiement Réussi !
          </h1>
          <p className="text-xl text-gray-600">
            Votre commande a été confirmée avec succès
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif de la commande</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Numéro de session</span>
              <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                {sessionId?.slice(0, 20)}...
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Montant total</span>
              <span className="text-2xl font-bold text-emerald-600">
                {orderDetails ? (orderDetails.amount_total / 100).toFixed(2) : '0.00'} €
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Statut du paiement</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                {orderDetails?.payment_status === 'paid' ? 'Payé' : 'En traitement'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Email de confirmation</span>
              <span className="text-gray-900">{orderDetails?.customer_details?.email}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📧 Email de confirmation envoyé
          </h3>
          <p className="text-gray-600 mb-4">
            Un email récapitulatif a été envoyé à {orderDetails?.customer_details?.email}. 
            Vous y trouverez tous les détails de votre commande.
          </p>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Important :</strong> Gardez cet email comme preuve d'achat.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/"
            className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continuer vos achats
          </Link>
          
          <Link
            href="/dashboard"
            className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Mon compte
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
