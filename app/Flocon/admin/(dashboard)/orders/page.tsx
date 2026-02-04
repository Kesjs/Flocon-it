"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, Eye, Search, Filter, ArrowLeft, RefreshCw, AlertCircle, CheckCircle, Clock, CreditCard } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total: number;
  items: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  date: string;
  validated_at?: string;
  validated_by?: string;
}

export default function FloconAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "validated" | "rejected">("pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erreur récupération commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "pending" && order.status === 'En attente') ||
                         (statusFilter === "validated" && order.status === 'Payé') ||
                         (statusFilter === "rejected" && order.status === 'Rejeté');
    
    return matchesSearch && matchesStatus;
  });

  const validateOrder = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      const response = await fetch(`/api/admin/orders/${orderId}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Payé',
          validated_by: 'admin@flocon.market'
        })
      });

      if (response.ok) {
        await fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Erreur validation:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const rejectOrder = async (orderId: string) => {
    try {
      setActionLoading(orderId);
      const response = await fetch(`/api/admin/orders/${orderId}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Rejeté',
          validated_by: 'admin@flocon.market'
        })
      });

      if (response.ok) {
        await fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Erreur rejet:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'Payé': return 'bg-green-900/50 text-green-300 border-green-700';
      case 'Rejeté': return 'bg-red-900/50 text-red-300 border-red-700';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En attente': return <Clock className="w-4 h-4" />;
      case 'Payé': return <CheckCircle className="w-4 h-4" />;
      case 'Rejeté': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Commandes Flocon Secure Transfer
          </h1>
          <p className="text-gray-400">
            Gestion des virements bancaires
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par commande ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
            >
              <option value="pending">En attente</option>
              <option value="validated">Validées</option>
              <option value="rejected">Rejetées</option>
              <option value="all">Toutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-yellow-400">
                {orders.filter(o => o.status === 'En attente').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Validées</p>
              <p className="text-2xl font-bold text-green-400">
                {orders.filter(o => o.status === 'Payé').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total aujourd'hui</p>
              <p className="text-2xl font-bold text-red-400">
                {orders.length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{order.id}</div>
                    <div className="text-sm text-gray-400">{order.items} article(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{order.shippingAddress.name}</div>
                    <div className="text-sm text-gray-400">{order.shippingAddress.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{order.total.toFixed(2)} €</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.date).toLocaleTimeString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {order.status === 'En attente' && (
                        <>
                          <button
                            onClick={() => validateOrder(order.id)}
                            disabled={actionLoading === order.id}
                            className="text-green-400 hover:text-green-300 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading === order.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => rejectOrder(order.id)}
                            disabled={actionLoading === order.id}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Modal détails commande */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Détails commande {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Informations client</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Nom:</span> {selectedOrder.shippingAddress.name}</p>
                    <p><span className="text-gray-400">Adresse:</span> {selectedOrder.shippingAddress.address}</p>
                    <p><span className="text-gray-400">Ville:</span> {selectedOrder.shippingAddress.city}</p>
                    <p><span className="text-gray-400">CP:</span> {selectedOrder.shippingAddress.postalCode}</p>
                    <p><span className="text-gray-400">Téléphone:</span> {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Informations commande</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Statut:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p><span className="text-gray-400">Montant:</span> {selectedOrder.total.toFixed(2)} €</p>
                    <p><span className="text-gray-400">Articles:</span> {selectedOrder.items}</p>
                    <p><span className="text-gray-400">Date:</span> {new Date(selectedOrder.date).toLocaleString('fr-FR')}</p>
                    {selectedOrder.validated_at && (
                      <p><span className="text-gray-400">Validée le:</span> {new Date(selectedOrder.validated_at).toLocaleString('fr-FR')}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-white mb-3">Produits commandés</h3>
                <div className="space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-gray-400">Quantité: {product.quantity}</p>
                      </div>
                      <p className="font-medium text-white">
                        {(product.price * product.quantity).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.status === 'En attente' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => validateOrder(selectedOrder.id)}
                    disabled={actionLoading === selectedOrder.id}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    {actionLoading === selectedOrder.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Valider le paiement
                  </button>
                  <button
                    onClick={() => rejectOrder(selectedOrder.id)}
                    disabled={actionLoading === selectedOrder.id}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
