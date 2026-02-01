"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, MapPin, User, Settings, ShoppingBag, TrendingUp, Calendar, CreditCard, RefreshCw, Filter, Search, X, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { OrderStorage, Order } from "@/lib/order-storage";
import { OrdersSection } from "./components/OrdersSection";
import { ProfileSection } from "./components/ProfileSection";
import { StatsSection } from "./components/StatsSection";

type View = "commandes" | "profil" | "statistiques";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("commandes");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "stripe" | "test">("all");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false); // Éviter les appels multiples
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !isLoadingOrders) {
      console.log('🔄 useEffect déclenché pour user:', user.id);
      setIsLoadingOrders(true);
      loadOrders();
    }
  }, [user]);

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

  const loadOrders = () => {
    console.log('🔄 loadOrders appelé - Début');
    setLoading(true);
    try {
      console.log('🔄 Chargement des commandes pour:', user?.id);
      
      if (!user?.id) {
        console.log('❌ User ID non disponible');
        setOrders([]);
        setFilteredOrders([]);
        return;
      }

      // Nettoyer les commandes en double avant de charger
      const duplicatesRemoved = OrderStorage.removeDuplicateOrders(user.id);
      if (duplicatesRemoved > 0) {
        console.log(`🧹 ${duplicatesRemoved} commandes en double supprimées`);
      }

      const userOrders = OrderStorage.getUserOrders(user.id);
      console.log('📦 Commandes chargées:', userOrders.length, userOrders.map(o => ({ id: o.id, total: o.total, items: o.items })));
      
      setOrders(userOrders);
      setFilteredOrders(userOrders);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des commandes:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
      setIsLoadingOrders(false); // Réinitialiser le flag
      console.log('✅ loadOrders terminé');
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
        console.error('❌ Erreur nettoyage:', error);
      }
    }
  };

  const menuItems = [
    { id: "commandes" as View, label: "Mes Commandes", icon: Package, count: orders.length },
    { id: "statistiques" as View, label: "Statistiques", icon: TrendingUp },
    { id: "profil" as View, label: "Profil", icon: User },
  ];

  if (authLoading || loading) {
    return (
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
            
            <div className="flex items-center gap-4">
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
              <Link
                href="/boutique"
                className="flex items-center gap-2 px-6 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Boutique
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
              isMobileMenuOpen ? "block" : "hidden lg:block"
            }`}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Espace</h2>
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

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleClearOrders}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Vider les commandes</span>
              </button>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

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
                />
              )}

              {currentView === "statistiques" && (
                <StatsSection orders={orders} user={user} />
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
