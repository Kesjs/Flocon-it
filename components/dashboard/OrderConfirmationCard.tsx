"use client";

import { motion } from "framer-motion";
import { CheckCircle, Truck, MapPin, Clock, Package } from "lucide-react";
import { Order } from "@/lib/order-storage";

interface OrderConfirmationCardProps {
  order: Order;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function OrderConfirmationCard({ 
  order, 
  isExpanded = false, 
  onToggle 
}: OrderConfirmationCardProps) {
  const isConfirmed = order.status === 'En préparation' || order.status === 'En cours';
  const isDelivered = order.status === 'Livré';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl overflow-hidden mb-4"
    >
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-green-50/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              {isDelivered ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <Truck className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {isDelivered ? 'Commande livrée !' : 'Commande confirmée'}
              </h3>
              <p className="text-sm text-gray-600">
                Commande #{order.id.slice(-8)}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              {order.total.toFixed(2)} €
            </p>
            <p className="text-sm text-gray-500">
              {order.items} article{order.items > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {isDelivered ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Livré
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                En préparation
              </>
            )}
          </span>
          
          {!isDelivered && (
            <span className="text-sm text-gray-600">
              Livraison prévue dans moins de 24h
            </span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="border-t border-green-200 bg-white/50"
        >
          <div className="p-6 space-y-6">
            {/* Confirmation Message */}
            <div className="bg-green-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">
                    {isDelivered ? 'Livraison réussie' : 'Tout est prêt !'}
                  </h4>
                  <p className="text-sm text-green-700">
                    {isDelivered 
                      ? 'Votre commande a été livrée à l\'adresse indiquée.'
                      : 'Votre commande est en cours de préparation et sera expédiée dans les plus brefs délais.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {order.shippingAddress && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse de livraison
                </h5>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Products Summary */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Récapitulatif
              </h5>
              <div className="space-y-2">
                {order.products.slice(0, 3).map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {product.quantity}x {product.name}
                    </span>
                    <span className="font-medium">
                      {(product.price * product.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
                {order.products.length > 3 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{order.products.length - 3} autre{order.products.length > 3 ? 's' : ''} article{order.products.length > 3 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Suivi simplifié</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Commande confirmée</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                {!isDelivered && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">En préparation</p>
                      <p className="text-xs text-gray-500">Expédition dans moins de 24h</p>
                    </div>
                  </div>
                )}
                
                {isDelivered && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Livré</p>
                      <p className="text-xs text-gray-500">Livré à l'adresse indiquée</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
