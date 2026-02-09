"use client";

import { motion } from "framer-motion";
import { Package, CheckCircle2, Truck, Home, Search } from "lucide-react";
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

const steps: OrderStep[] = [
  {
    id: "confirmed",
    label: "Ordine confermato",
    description: "Il tuo ordine è stato ricevuto",
    icon: CheckCircle2,
  },
  {
    id: "preparing",
    label: "In preparazione",
    description: "Il tuo ordine è in preparazione",
    icon: Package,
  },
  {
    id: "shipped",
    label: "Spedita",
    description: "Il tuo ordine è stato spedito",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Consegnata",
    description: "Il tuo ordine è stato consegnato",
    icon: Home,
  },
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Simulation de recherche de commande
  const handleSearch = () => {
    if (!orderId.trim()) return;
    setIsSearching(true);
    // Simulation d'une recherche
    setTimeout(() => {
      // Simule différents statuts selon l'ID
      const statusMap: Record<string, OrderStatus> = {
        "CMD-001": "delivered",
        "CMD-002": "shipped",
        "CMD-003": "preparing",
      };
      setCurrentStatus(statusMap[orderId] || "confirmed");
      setIsSearching(false);
    }, 1000);
  };

  const getStepIndex = (status: OrderStatus) => {
    return steps.findIndex((step) => step.id === status);
  };

  const currentStepIndex = currentStatus ? getStepIndex(currentStatus) : -1;

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
                placeholder="Ex: CMD-001, CMD-002, CMD-003"
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

          {/* Progress Bar */}
          {currentStatus && (
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
                    <p className="font-semibold text-textDark">{orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut actuel</p>
                    <p className="font-semibold text-rose-custom">
                      {steps[currentStepIndex]?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date de commande</p>
                    <p className="font-semibold text-textDark">22 Jan 2026</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Livraison estimée</p>
                    <p className="font-semibold text-textDark">
                      {currentStatus === "delivered"
                        ? "Livrée"
                        : currentStatus === "shipped"
                        ? "25 Jan 2026"
                        : "27 Jan 2026"}
                    </p>
                  </div>
                </div>
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
          {!currentStatus && !isSearching && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Entrez un numéro de commande pour commencer le suivi
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Exemples : CMD-001 (livrée), CMD-002 (expédiée), CMD-003 (en préparation)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
