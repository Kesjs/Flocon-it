import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Filter, CreditCard, Check, Clock, Truck, MapPin, Calendar, Eye, RefreshCw } from "lucide-react";
import { Order } from "@/lib/order-storage";
import { syncPendingOrders, forceUpdateOrder } from "@/lib/order-sync";
import { debugOrders, createTestOrder } from "@/lib/debug-orders";

interface OrdersSectionProps {
  orders: Order[];
  loading: boolean;
  searchTerm: string;
  filterType: "all" | "stripe" | "test";
  onSearchChange: (term: string) => void;
  onFilterChange: (type: "all" | "stripe" | "test") => void;
  onOrdersChange: () => void;
  userId: string; // Ajouter userId pour la synchronisation
}

export function OrdersSection({
  orders,
  loading,
  searchTerm,
  filterType,
  onSearchChange,
  onFilterChange,
  onOrdersChange,
  userId
}: OrdersSectionProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fonction de synchronisation manuelle
  const handleSyncOrders = async () => {
    console.log('🔄 Bouton synchronisation cliqué pour userId:', userId);
    setIsSyncing(true);
    
    try {
      // Vérifier que userId est disponible
      if (!userId) {
        console.error('❌ userId non disponible pour la synchronisation');
        alert('Erreur: utilisateur non identifié');
        return;
      }
      
      console.log('📦 Lancement synchronisation...');
      const syncedCount = syncPendingOrders(userId);
      
      console.log(`🎯 Résultat synchronisation: ${syncedCount} commandes mises à jour`);
      
      if (syncedCount > 0) {
        alert(`✅ ${syncedCount} commande(s) synchronisée(s) avec succès!`);
        onOrdersChange(); // Recharger les commandes
      } else {
        alert('ℹ️ Aucune commande en attente de synchronisation trouvée');
      }
    } catch (error) {
      console.error('❌ Erreur synchronisation:', error);
      alert('❌ Erreur lors de la synchronisation: ' + (error as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Fonction pour forcer la mise à jour d'une commande
  const handleForceUpdate = (orderId: string) => {
    const defaultAddress = {
      name: 'Client',
      address: 'Adresse mise à jour manuellement',
      city: 'Ville mise à jour',
      postalCode: '00000',
      phone: 'Téléphone mis à jour'
    };
    
    if (forceUpdateOrder(orderId, defaultAddress)) {
      onOrdersChange(); // Recharger les commandes
    }
  };

  // Fonction de debug
  const handleDebug = () => {
    console.log('🔍 Lancement debug commandes...');
    debugOrders(userId);
  };

  // Fonction pour créer une commande de test
  const handleCreateTestOrder = () => {
    const testOrder = createTestOrder(userId);
    if (testOrder) {
      onOrdersChange(); // Recharger les commandes
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré': return 'bg-green-100 text-green-800';
      case 'En préparation': return 'bg-blue-100 text-blue-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Livré': return <Check className="w-3 h-3" />;
      case 'En préparation': return <Clock className="w-3 h-3" />;
      case 'En cours': return <CreditCard className="w-3 h-3" />;
      default: return null;
    }
  };

  const getOrderType = (orderId: string) => {
    if (orderId.includes('cs_test_')) {
      return { type: 'stripe', label: 'Stripe', color: 'bg-purple-100 text-purple-800', icon: <CreditCard className="w-3 h-3" /> };
    }
    if (orderId.includes('CMD-')) {
      return { type: 'test', label: 'Test', color: 'bg-green-100 text-green-800', icon: <Check className="w-3 h-3" /> };
    }
    return { type: 'unknown', label: 'Inconnu', color: 'bg-gray-100 text-gray-800', icon: null };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-rose-custom border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Chargement des commandes...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
          <p className="text-gray-600 mt-1">
            {orders.length} commande{orders.length > 1 ? 's' : ''}
            {orders.filter(o => o.status === 'En préparation').length > 0 && 
              ` • ${orders.filter(o => o.status === 'En préparation').length} en attente de synchronisation`}
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={handleSyncOrders}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-custom focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as "all" | "stripe" | "test")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-custom focus:border-transparent"
          >
            <option value="all">Toutes</option>
            <option value="stripe">Stripe</option>
            <option value="test">Test</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
          <p className="text-gray-600 mb-6">
            {filterType !== 'all' 
              ? `Aucune commande ${filterType} trouvée` 
              : "Commencez vos achats pour voir vos commandes ici"
            }
          </p>
          <button
            onClick={onOrdersChange}
            className="px-6 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors"
          >
            Actualiser
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const orderType = getOrderType(order.id);
            const isExpanded = expandedOrder === order.id;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Commande #{order.id.slice(-8)}
                        </h3>
                        
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${orderType.color}`}>
                          {orderType.icon}
                          {orderType.label}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-rose-custom">
                        {order.total.toFixed(2)} €
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items} article{order.items > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Products Preview */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Package className="w-4 h-4" />
                    <span>
                      {order.products.slice(0, 2).map(p => p.name).join(', ')}
                      {order.products.length > 2 && ` +${order.products.length - 2} autre${order.products.length > 2 ? 's' : ''}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {order.shippingAddress && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">
                          {order.shippingAddress.address}, {order.shippingAddress.city}
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-rose-custom hover:text-rose-custom/80 transition-colors bg-rose-custom/10 hover:bg-rose-custom/20 rounded-lg min-h-[44px] w-full sm:w-auto"
                    >
                      <Eye className="w-4 h-4" />
                      {isExpanded ? 'Masquer' : 'Détails'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="border-t border-gray-200 bg-gray-50"
                  >
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Détails de la commande</h4>
                      
                      {/* Products List */}
                      <div className="space-y-3 mb-6">
                        {order.products.map((product, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">
                                Quantité: {product.quantity} × {product.price.toFixed(2)} €
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {(product.price * product.quantity).toFixed(2)} €
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">Adresse de livraison</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                            <p>{order.shippingAddress.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
