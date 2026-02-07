"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, MapPin, User, Settings, ShoppingBag, TrendingUp, Calendar, CreditCard, RefreshCw, Filter, Search, X, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { OrderStorage, Order } from "@/lib/order-storage";
import { UnifiedOrderManager } from "@/lib/unified-order-manager";
import { OrdersSection } from "./components/OrdersSection";
import { ProfileSection } from "./components/ProfileSection";
import { StatsSection } from "./components/StatsSection";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { UserNotificationProvider, UserNotificationPanel, useUserNotifications } from "@/components/user/UserNotificationSystem";

type View = "commandes" | "profil" | "statistiques";

// Composant interne pour utiliser le contexte de notifications utilisateur
function DashboardWithNotifications() {
  const { addNotification } = useUserNotifications();
  const [currentView, setCurrentView] = useState<View>("commandes");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "stripe" | "test">("all");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const orderManagerRef = useRef<UnifiedOrderManager | null>(null);

  useEffect(() => {
    // Attendre que l'auth soit complètement chargée avant de vérifier
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        
        // Initialiser le gestionnaire unifié
        initializeOrderManager();
      }
    }
  }, [user, authLoading]);

  // Initialiser le gestionnaire de commandes unifié
  const initializeOrderManager = async () => {
    if (!user?.email || !user?.id) return;

    try {
      // Créer et initialiser le gestionnaire unifié
      const orderManager = new UnifiedOrderManager(user.id, user.email);
      orderManagerRef.current = orderManager;

      // Demander la permission pour les notifications
      await orderManager.requestNotificationPermission();

      // Initialiser la synchronisation temps réel
      await orderManager.initialize();
      setIsRealtimeActive(true);

      // Configurer les écouteurs d'événements
      setupEventListeners();

      // Charger les commandes initiales
      loadOrders();

    } catch (error) {
      // Fallback: charger les commandes locales uniquement
      loadOrders();
    }
  };

  // Configurer les écouteurs d'événements personnalisés
  const setupEventListeners = () => {
    // Écouter les mises à jour de commandes
    const handleOrderUpdate = (event: CustomEvent) => {
      loadOrders(); // Recharger les commandes
    };

    // Écouter les notifications
    const handleNotification = (event: CustomEvent) => {
      const { title, body } = event.detail;
      addNotification({ title, message: body, type: 'info' });
    };

    window.addEventListener('orderUpdated', handleOrderUpdate as EventListener);
    window.addEventListener('ordersSynced', handleOrderUpdate as EventListener);
    window.addEventListener('showNotification', handleNotification as EventListener);

    // Nettoyer les écouteurs au démontage
    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate as EventListener);
      window.removeEventListener('ordersSynced', handleOrderUpdate as EventListener);
      window.removeEventListener('showNotification', handleNotification as EventListener);
    };
  };

  useEffect(() => {
    if (user && !authLoading && !isLoadingOrders) {
      setIsLoadingOrders(true);
      
      // Si le gestionnaire unifié est initialisé, il gère le chargement
      if (orderManagerRef.current) {
        loadOrders();
      } else {
        // Sinon, charger localement
        loadOrders();
      }
    }
  }, [user, authLoading]);

  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      if (orderManagerRef.current) {
        orderManagerRef.current.cleanup();
      }
    };
  }, []);

  useEffect(() => {
    // Filtrer les commandes
    let filtered = orders;

    // Filtrer par type
    if (filterType === "stripe") {
      filtered = filtered.filter(order => order.id.includes('cs_test_'));
    } else if (filterType === "test") {
      filtered = filtered.filter(order => order.id.includes('CMD-') && !order.id.includes('cs_test_'));
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, filterType]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      
      if (!user?.id) {
        setOrders([]);
        setFilteredOrders([]);
        return;
      }

      // Nettoyer les commandes en double avant de charger
      const duplicatesRemoved = OrderStorage.removeDuplicateOrders(user.id);
      if (duplicatesRemoved > 0) {
      }

      // Si le gestionnaire unifié est disponible, utiliser la synchronisation complète
      if (orderManagerRef.current) {
        await orderManagerRef.current.fullSync();
      }

      const userOrders = OrderStorage.getUserOrders(user.id);
      
      setOrders(userOrders);
      setFilteredOrders(userOrders);
    } catch (error) {
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleClearOrders = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes vos commandes ? Cette action est irréversible.')) {
      try {
        // Nettoyer toutes les données
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('flocon') || key.includes('order') || key.includes('cart'))) {
            keysToRemove.push(key);
            localStorage.removeItem(key);
          }
        }
        
        setOrders([]);
        setFilteredOrders([]);
        setIsLoadingOrders(false); // Réinitialiser le flag
        alert(`✅ ${keysToRemove.length} entrées supprimées !`);
      } catch (error) {
      }
    }
  };

  const menuItems = [
    { id: "commandes" as View, label: "Mes Commandes", icon: Package, count: orders.length },
    { id: "statistiques" as View, label: "Statistiques", icon: TrendingUp },
    { id: "profil" as View, label: "Profil", icon: User },
  ];

  // Synchronisation manuelle
  const handleManualSync = async () => {
    if (orderManagerRef.current) {
      const success = await orderManagerRef.current.fullSync();
      if (success) {
        loadOrders();
        addNotification({
          type: 'success',
          title: 'Synchronisation réussie',
          message: 'Vos commandes ont été synchronisées avec succès'
        });
      }
    } else {
      loadOrders();
    }
  };

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Link 
            href="/login" 
            className="px-6 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-rose-custom/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-rose-custom" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const emailUsername = user.email?.split('@')[0];
                    return emailUsername 
                      ? emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1)
                      : 'Utilisateur';
                  })()}
                </h1>
                <p className="text-sm text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Indicateur de synchronisation temps réel */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                <div className={`w-2 h-2 rounded-full ${isRealtimeActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                <span className="text-xs font-medium">
                  {isRealtimeActive ? 'Temps réel' : 'Hors ligne'}
                </span>
              </div>
              
              <Link
                href="/boutique"
                className="flex items-center justify-center gap-2 px-6 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4" />
                Boutique
              </Link>
              
              {/* Notifications utilisateur */}
              <UserNotificationPanel />
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
              {/* Mobile Menu Button - Sidebar */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-rose-custom text-white rounded-full shadow-lg hover:bg-rose-custom/90 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: isMobileMenuOpen ? 0 : -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Mon Espace</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentView(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          currentView === item.id
                            ? "bg-rose-custom text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            currentView === item.id
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>

            {/* Desktop Sidebar */}
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden lg:block lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Espace</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        currentView === item.id
                          ? "bg-rose-custom text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          currentView === item.id
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.aside>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {currentView === "commandes" && (
                <OrdersSection
                  orders={filteredOrders}
                  loading={loading}
                  searchTerm={searchTerm}
                  filterType={filterType}
                  onSearchChange={setSearchTerm}
                  onFilterChange={setFilterType}
                  onOrdersChange={loadOrders}
                  userId={user?.id || ''}
                  isRealtimeActive={isRealtimeActive}
                  onManualSync={handleManualSync}
                />
              )}

              {currentView === "statistiques" && (
                <StatsSection 
                  orders={orders} 
                  user={user} 
                  orderManager={orderManagerRef.current}
                />
              )}

              {currentView === "profil" && (
                <ProfileSection user={user} onLogout={handleLogout} />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Composant principal avec le provider
export default function Dashboard() {
  return (
    <UserNotificationProvider>
      <DashboardWithNotifications />
    </UserNotificationProvider>
  );
}
