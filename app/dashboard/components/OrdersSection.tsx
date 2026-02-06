import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Search, Filter, CreditCard, Check, Clock, 
  Truck, MapPin, Calendar, Eye, RefreshCw, AlertCircle,
  ChevronDown, ChevronUp, Box, Info, CheckCircle2
} from "lucide-react";
import { Order } from "@/lib/order-storage";
import { syncPendingOrders, forceUpdateOrder } from "@/lib/order-sync";
import { debugOrders, createTestOrder } from "@/lib/debug-orders";
import { useUserNotifications } from "@/components/user/UserNotificationSystem";
import { OrderConfirmationCard } from "@/components/dashboard/OrderConfirmationCard";

interface OrdersSectionProps {
  orders: Order[];
  loading: boolean;
  searchTerm: string;
  filterType: "all" | "stripe" | "test";
  onSearchChange: (term: string) => void;
  onFilterChange: (type: "all" | "stripe" | "test") => void;
  onOrdersChange: () => Promise<void>;
  userId: string;
  isRealtimeActive?: boolean;
  onManualSync?: () => Promise<void>;
}

export function OrdersSection({
  orders,
  loading,
  searchTerm,
  filterType,
  onSearchChange,
  onFilterChange,
  onOrdersChange,
  userId,
  isRealtimeActive = false,
  onManualSync
}: OrdersSectionProps) {
  const { addNotification } = useUserNotifications();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [expandedConfirmation, setExpandedConfirmation] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Optimisation du filtrage des commandes
  const { confirmedOrders, otherOrders } = useMemo(() => {
    const confirmed = orders.filter(order => 
      ['En préparation', 'En cours', 'Livré'].includes(order.status)
    );
    const others = orders.filter(order => 
      !confirmed.some(c => c.id === order.id)
    );
    return { confirmedOrders: confirmed, otherOrders: others };
  }, [orders]);

  const handleSyncOrders = async () => {
    setIsSyncing(true);
    try {
      if (!userId) throw new Error('Utilisateur non identifié');
      
      const syncedCount = syncPendingOrders(userId);
      
      addNotification({
        type: syncedCount > 0 ? 'success' : 'info',
        title: syncedCount > 0 ? 'Synchronisation réussie' : 'Synchronisation',
        message: syncedCount > 0 ? `${syncedCount} commande(s) synchronisée(s)` : 'Aucune nouvelle commande'
      });
      
      await onOrdersChange();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de synchroniser les commandes'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Livré': return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      case 'En préparation': return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3.5 h-3.5" /> };
      case 'En cours': return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> };
      default: return { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: <Info className="w-3.5 h-3.5" /> };
    }
  };

  const getOrderTypeStyles = (orderId: string) => {
    if (orderId.includes('cs_test_')) {
      return { label: 'Stripe', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: <CreditCard className="w-3.5 h-3.5" /> };
    }
    return { label: 'Test', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: <Box className="w-3.5 h-3.5" /> };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="w-10 h-10 text-rose-custom animate-spin mb-4" />
        <p className="text-slate-500 font-medium italic">Récupération de vos commandes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mes Commandes</h2>
          <div className="flex items-center gap-3 mt-2 text-slate-500">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md text-sm font-medium">
              <Package className="w-4 h-4" />
              {orders.length} au total
            </div>
            {isRealtimeActive && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium animate-pulse">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Live
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onManualSync || handleSyncOrders}
            disabled={isSyncing}
            className="group flex items-center gap-2 px-5 py-2.5 bg-rose-custom text-white rounded-xl hover:bg-rose-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {isSyncing ? 'Synchronisation...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-custom transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par ID, produit..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-custom transition-all outline-none shadow-sm"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-custom transition-all outline-none appearance-none shadow-sm cursor-pointer"
          >
            <option value="all">Tous les types</option>
            <option value="stripe">Paiements Stripe</option>
            <option value="test">Commandes Test</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Main Content */}
      {orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
        >
          <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Box className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-8">
            {filterType !== 'all' 
              ? `Nous n'avons trouvé aucune commande correspondant au filtre "${filterType}".` 
              : "Vous n'avez pas encore passé de commande."
            }
          </p>
          <button
            onClick={() => onFilterChange('all')}
            className="text-rose-custom font-semibold hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Confirmed Orders Container */}
          <div className="space-y-4">
            {confirmedOrders.map((order) => (
              <OrderConfirmationCard
                key={order.id}
                order={order}
                isExpanded={expandedConfirmation === order.id}
                onToggle={() => setExpandedConfirmation(
                  expandedConfirmation === order.id ? null : order.id
                )}
              />
            ))}
          </div>
          
          {/* Separator if both types exist */}
          {confirmedOrders.length > 0 && otherOrders.length > 0 && (
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-slate-400 bg-white px-4">Historique & Autres</div>
            </div>
          )}

          {/* Regular Orders */}
          <div className="space-y-4">
            {otherOrders.map((order, index) => {
              const status = getStatusStyles(order.status);
              const type = getOrderTypeStyles(order.id);
              const isExpanded = expandedOrder === order.id;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white border rounded-2xl transition-all duration-300 ${
                    isExpanded ? 'ring-1 ring-slate-200 shadow-xl' : 'border-slate-200 hover:border-rose-200 hover:shadow-md'
                  }`}
                >
                  <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                            {status.icon}
                            {order.status}
                          </span>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${type.color}`}>
                            {type.icon}
                            {type.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Box className="w-4 h-4" />
                            {order.items} article{order.items > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">
                          {order.total.toFixed(2)}<span className="text-sm ml-0.5">€</span>
                        </div>
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className={`mt-2 flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            isExpanded 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-rose-50 text-rose-custom hover:bg-rose-100'
                          }`}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {isExpanded ? 'Fermer' : 'Voir détails'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                      >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left: Items */}
                          <div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Package className="w-4 h-4" /> Articles commandés
                            </h4>
                            <div className="space-y-3">
                              {order.products.map((product, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                  <div className="relative">
                                    <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-slate-100" />
                                    <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                      {product.quantity}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{product.name}</p>
                                    <p className="text-xs text-slate-500">{product.price.toFixed(2)} € l'unité</p>
                                  </div>
                                  <p className="font-bold text-slate-900">{(product.price * product.quantity).toFixed(2)} €</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Info & Shipping */}
                          <div className="space-y-6">
                            {order.shippingAddress && (
                              <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" /> Livraison
                                </h4>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-sm space-y-1">
                                  <p className="font-bold text-slate-900">{order.shippingAddress.name}</p>
                                  <p className="text-slate-600">{order.shippingAddress.address}</p>
                                  <p className="text-slate-600">{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                                  <p className="text-rose-custom font-medium pt-1">{order.shippingAddress.phone}</p>
                                </div>
                              </div>
                            )}

                            <div>
                              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Truck className="w-4 h-4" /> Suivi logistique
                              </h4>
                              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                                {order.trackingNumber && !order.trackingNumber.startsWith('EN_PREPARATION_') ? (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
                                      <span className="text-xs font-bold text-rose-800 uppercase">N° Suivi</span>
                                      <span className="font-mono font-bold text-rose-custom uppercase tracking-wider">{order.trackingNumber}</span>
                                    </div>
                                    <button
                                      onClick={() => window.open(`https://www.laposte.fr/particulier/suivre-vos-envois?code=${order.trackingNumber}`, '_blank')}
                                      className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm"
                                    >
                                      Suivre sur le site transporteur
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-center py-2">
                                    <div className="inline-flex p-3 bg-amber-50 rounded-full mb-3">
                                      <Clock className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">En attente d'expédition</p>
                                    <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
                                      Le numéro de suivi sera généré automatiquement dès que le colis quittera notre entrepôt.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}