"use client";

import { motion } from "framer-motion";
import { Package, CheckCircle2, Truck, Home, Search, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type OrderStatus = "confirmed" | "preparing" | "shipped" | "delivered";

interface OrderStep {
  id: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface OrderData {
  id: string;
  status: OrderStatus;
  trackingNumber?: string;
  fstStatus: string;
  total: number;
  created_at: string;
  updated_at: string;
  user_email: string;
}

const steps: OrderStep[] = [
  {
    id: "confirmed",
    label: "Commande confirmée",
    description: "Votre commande a été reçue",
    icon: CheckCircle2,
  },
  {
    id: "preparing",
    label: "En préparation",
    description: "Votre commande est en cours de préparation",
    icon: Package,
  },
  {
    id: "shipped",
    label: "Expédiée",
    description: "Votre commande a été expédiée",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Livrée",
    description: "Votre commande a été livrée",
    icon: Home,
  },
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recherche de commande réelle
  const handleSearch = async () => {
    if (!orderId.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setOrderData(null);
    
    try {
      const response = await fetch(`/api/track?orderId=${orderId.trim()}`);
      const result = await response.json();
      
      if (result.success) {
        setOrderData(result.order);
        console.log('✅ Commande trouvée:', result.order);
      } else {
        setError(result.error || 'Commande non trouvée');
        console.log('❌ Erreur recherche:', result.error);
      }
    } catch (error) {
      console.error('💥 Erreur réseau:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSearching(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return steps.findIndex((step) => step.id === status);
  };

  const currentStepIndex = orderData ? getStepIndex(orderData.status) : -1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="pt-28 min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rose-custom hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-display font-bold text-textDark mb-2">
            Suivi de commande
          </h1>
          <p className="text-gray-600 mb-8">
            Entrez votre numéro de commande pour suivre votre livraison
          </p>

          {/* Search Bar */}
          <div className="flex gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Ex: CMD-1770627789044"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !orderId.trim()}
              className="px-6 py-3 bg-textDark text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Recherche..." : "Rechercher"}
            </button>
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Erreur</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress Bar */}
          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Progress Steps */}
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="h-full bg-rose-custom"
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center"
                        style={{ flex: 1 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                            isCompleted
                              ? "bg-rose-custom border-rose-custom text-white"
                              : "bg-white border-gray-200 text-gray-400"
                          } ${isCurrent ? "ring-4 ring-rose/20" : ""}`}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        <div className="mt-4 text-center max-w-[150px]">
                          <p
                            className={`font-semibold text-sm ${
                              isCompleted ? "text-textDark" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h2 className="text-xl font-display font-semibold text-textDark mb-4">
                  Détails de la commande
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Numéro de commande</p>
                    <p className="font-semibold text-textDark">{orderData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut actuel</p>
                    <p className="font-semibold text-rose-custom">
                      {steps[currentStepIndex]?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de commande</p>
                    <p className="font-semibold text-textDark">{formatDate(orderData.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Montant total</p>
                    <p className="font-semibold text-textDark">{orderData.total.toFixed(2)}€</p>
                  </div>
                </div>

                {/* Tracking Number */}
                {orderData.trackingNumber && !orderData.trackingNumber.startsWith('EN_PREPARATION_') && (
                  <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-rose-800">Numéro de suivi</p>
                        <p className="font-mono font-bold text-rose-custom text-lg">{orderData.trackingNumber}</p>
                      </div>
                      <button
                        onClick={() => window.open(`https://www.laposte.fr/particulier/suivre-vos-envois?code=${orderData.trackingNumber}`, '_blank')}
                        className="px-4 py-2 bg-rose-custom text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        Suivre sur La Poste
                      </button>
                    </div>
                  </div>
                )}

                {/* Status Message */}
                {orderData.fstStatus === 'declared' && (
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-800">En attente de validation</p>
                        <p className="text-amber-600 text-sm">Votre virement est en cours de vérification par notre équipe.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Text */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  Des questions ?{" "}
                  <Link href="/contact" className="text-rose-custom hover:underline">
                    Contactez-nous
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!orderData && !isSearching && !error && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Entrez un numéro de commande pour commencer le suivi
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Utilisez le numéro de commande reçu par email
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
