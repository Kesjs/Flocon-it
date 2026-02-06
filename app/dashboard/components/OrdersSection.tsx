import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Filter, CreditCard, Check, Clock, Truck, MapPin, Calendar, Eye, RefreshCw } from "lucide-react";
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

  // Separate confirmed orders from others
  const confirmedOrders = orders.filter(order => 
    order.status === 'En préparation' || order.status === 'En cours' || order.status === 'Livré'
  );
  const otherOrders = orders.filter(order => 
    !confirmedOrders.find(confirmed => confirmed.id === order.id)
  );

  // Fonction de synchronisation manuelle
  const handleSyncOrders = async () => {
    console.log('🔄 Bouton synchronisation cliqué pour userId:', userId);
    setIsSyncing(true);
    
    try {
      // Vérifier que userId est disponible
      if (!userId) {
        console.error('❌ userId non disponible pour la synchronisation');
        addNotification({
          type: 'error',
          title: 'Erreur de synchronisation',
          message: 'Utilisateur non identifié'
        });
        return;
      }
      
      console.log('📦 Lancement synchronisation...');
      const syncedCount = syncPendingOrders(userId);
      
      if (syncedCount > 0) {
        addNotification({
          type: 'success',
          title: 'Synchronisation réussie',
          message: `${syncedCount} commande(s) synchronisée(s) avec succès`
        });
      } else {
        addNotification({
          type: 'info',
          title: 'Synchronisation',
          message: 'Aucune nouvelle commande à synchroniser'
        });
      }
      
      await onOrdersChange();
    } catch (error) {
      console.error('❌ Erreur synchronisation:', error);
      addNotification({
        type: 'error',
        title: 'Erreur de synchronisation',
        message: 'Impossible de synchroniser les commandes'
      });
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
      addNotification({
        type: 'success',
        title: 'Adresse mise à jour',
        message: 'L\'adresse de livraison a été mise à jour avec succès'
      });
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
      addNotification({
        type: 'success',
        title: 'Commande de test créée',
        message: 'Une commande de test a été ajoutée à votre historique'
      });
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
            {isRealtimeActive && ' • Synchronisation temps réel active'}
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          {isRealtimeActive && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Temps réel</span>
            </div>
          )}
          
          <button
            onClick={onManualSync || handleSyncOrders}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronisation...' : (isRealtimeActive ? 'Forcer Sync' : 'Synchroniser')}
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
          {/* Confirmed Orders - Confirmation Cards First */}
          {confirmedOrders.map((order, index) => (
            <OrderConfirmationCard
              key={order.id}
              order={order}
              isExpanded={expandedConfirmation === order.id}
              onToggle={() => setExpandedConfirmation(
                expandedConfirmation === order.id ? null : order.id
              )}
            />
          ))}
          
          {/* Other Orders - Regular Display */}
          {otherOrders.map((order, index) => {
            const orderType = getOrderType(order.id);
            const isExpanded = expandedOrder === order.id;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (confirmedOrders.length + index) * 0.1 }}
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

                      {/* Tracking Section */}
                      <div className="bg-white rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Suivi de colis</h5>
                        {order.trackingNumber ? (
                          <div className="space-y-3">
                            {order.trackingNumber.startsWith('EN_PREPARATION_') ? (
                              <div className="text-center py-4">
                                <Truck className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 mb-1">
                                  Votre commande est en préparation
                                </p>
                                <p className="text-xs text-gray-500">
                                  Le numéro de suivi sera disponible dès l'expédition
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Numéro de suivi :</span>
                                  <span className="font-mono text-sm font-semibold text-rose-custom bg-rose-custom/10 px-2 py-1 rounded">
                                    {order.trackingNumber}
                                  </span>
                                </div>
                                <button
                                  onClick={() => window.open(`https://www.laposte.fr/particulier/suivre-vos-envois?code=${order.trackingNumber}`, '_blank')}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors"
                                >
                                  <Truck className="w-4 h-4" />
                                  Suivre mon colis
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-1">
                              {order.status === 'En préparation' || order.status === 'En cours' 
                                ? 'Votre colis est en préparation'
                                : order.status === 'Livré'
                                ? 'Le numéro de suivi sera bientôt disponible'
                                : 'Le suivi sera disponible dès expédition'
                              }
                            </p>
                            {order.status === 'En préparation' && (
                              <p className="text-xs text-gray-500">
                                Vous recevrez un email avec le numéro de suivi dès que votre commande sera expédiée
                              </p>
                            )}
                          </div>
                        )}
                      </div>
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
