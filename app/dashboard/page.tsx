"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, MapPin, User, LogOut, Menu, X, ShoppingBag, Heart, TrendingUp, Calendar, CreditCard, Settings, Bell, Star, ArrowUpRight, ArrowDownRight, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type View = "commandes" | "adresses" | "profil" | "statistiques";

interface Order {
  id: string;
  date: string;
  status: "Consegnato" | "In corso" | "In preparazione";
  total: number;
  items: number;
  products?: string[];
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategory: string;
  memberSince: string;
  loyaltyPoints: number;
  nextReward: string;
}

const mockOrders: Order[] = [
  {
    id: "CMD-001",
    date: "15 Jan 2026",
    status: "Consegnato",
    total: 149.97,
    items: 3,
    products: ["Plaid con maniche", "Candela WoodWick Ellipse", "Coperta Elettrica"]
  },
  {
    id: "CMD-002",
    date: "20 Jan 2026",
    status: "In corso",
    total: 89.99,
    items: 2,
    products: ["Duo di Tazze Cuore", "Bracciali Coppia Magnetici"]
  },
  {
    id: "CMD-003",
    date: "22 Jan 2026",
    status: "In preparazione",
    total: 59.99,
    items: 1,
    products: ["Rosa Eterna Dôme Vetro"]
  },
  {
    id: "CMD-004",
    date: "25 Jan 2026",
    status: "In corso",
    total: 129.99,
    items: 2,
    products: ["Pack Serata Amore", "Kit Massaggio Coppia Luxe"]
  },
];

const mockStats: Stats = {
  totalOrders: 12,
  totalSpent: 1254.85,
  favoriteCategory: "San Valentino",
  memberSince: "Dicembre 2025",
  loyaltyPoints: 450,
  nextReward: "-50€ su prossimo ordine (500 punti)"
};

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("commandes");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const menuItems = [
    { id: "statistiques" as View, label: "Statistiche", icon: TrendingUp },
    { id: "commandes" as View, label: "I Miei Ordini", icon: Package },
    { id: "adresses" as View, label: "Indirizzi", icon: MapPin },
    { id: "profil" as View, label: "Profilo", icon: User },
  ];

  return (
    <div className="pt-28 min-h-screen bg-cream">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-custom"></div>
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p>Redirection vers la page de connexion...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden mb-4 p-2 hover:bg-white rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* En-tête personnalisé */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-rose-custom to-iceBlue rounded-2xl p-8 mb-8 text-white shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-black mb-2">
                    Bienvenue, {user?.email ? user.email.split('@')[0]?.charAt(0)?.toUpperCase() + user.email.split('@')[0]?.slice(1) : 'Client'} ! 
                  </h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Membre depuis {mockStats.memberSince}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {mockStats.totalOrders} commandes
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {mockStats.favoriteCategory}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
                <div className="text-center lg:text-right">
                  <div className="text-3xl font-black mb-1">{mockStats.loyaltyPoints}</div>
                  <div className="text-sm text-white/80 font-medium">Points fidélité</div>
                  <div className="text-xs text-white/60 mt-1">{500 - mockStats.loyaltyPoints} pts avant récompense</div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-3xl font-black mb-1">{mockStats.totalSpent.toFixed(0)}€</div>
                  <div className="text-sm text-white/80 font-medium">Total dépensé</div>
                  <div className="text-xs text-white/60 mt-1">{mockStats.totalOrders} commandes</div>
                </div>
                <div className="hidden lg:block w-px h-16 bg-white/30"></div>
                <Link
                  href="/boutique"
                  className="px-8 py-4 bg-white text-rose-custom rounded-xl hover:bg-white/90 transition-all duration-300 font-black flex items-center justify-center gap-2 shadow-xl hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Boutique</span>
                </Link>
              </div>
            </div>
            
            {/* Barre de progression fidélité */}
            <div className="mt-6 bg-white/20 rounded-full p-1">
              <div className="flex items-center justify-between text-xs text-white/80 mb-2 px-2">
                <span>Programme de fidélité</span>
                <span>{Math.round((mockStats.loyaltyPoints / 500) * 100)}%</span>
              </div>
              <div className="bg-white/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-1000 ease-out relative"
                  style={{ width: `${(mockStats.loyaltyPoints / 500) * 100}%` }}
                >
                  <div className="absolute right-0 top-0 w-2 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`lg:w-64 bg-white rounded-lg shadow-md p-6 ${
                isMobileMenuOpen ? "block" : "hidden lg:block"
              }`}
            >
              <h2 className="text-2xl font-display font-bold text-textDark mb-6">
                Il Mio Account
              </h2>
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentView === item.id
                        ? "bg-rose-custom text-white"
                        : "text-textDark hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              </nav>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-6"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Disconnessione</span>
              </button>
            </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white rounded-2xl shadow-lg p-6 lg:p-8"
          >
            {/* Vue Statistiques */}
            {currentView === "statistiques" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-textDark mb-2">
                      Le Mie Statistiche
                    </h1>
                    <p className="text-gray-600">Segui la tua attività e le tue ricompense</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-custom to-iceBlue text-white rounded-full">
                    <Star className="w-5 h-5" />
                    <span className="font-semibold">{mockStats.loyaltyPoints} punti</span>
                  </div>
                </div>

                {/* Carte di statistiche */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-rose-custom-50 to-rose-custom-100 p-6 rounded-xl border border-rose-custom-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <ShoppingBag className="w-8 h-8 text-rose-custom" />
                      <ArrowUpRight className="w-4 h-4 text-rose-custom" />
                    </div>
                    <div className="text-2xl font-bold text-textDark">{mockStats.totalOrders}</div>
                    <div className="text-sm text-gray-600">Ordini totali</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-iceBlue-50 to-iceBlue-100 p-6 rounded-xl border border-iceBlue-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <CreditCard className="w-8 h-8 text-iceBlue" />
                      <TrendingUp className="w-4 h-4 text-iceBlue" />
                    </div>
                    <div className="text-2xl font-bold text-textDark">{mockStats.totalSpent.toFixed(2)} €</div>
                    <div className="text-sm text-gray-600">Totale speso</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Heart className="w-8 h-8 text-purple" />
                      <Calendar className="w-4 h-4 text-purple" />
                    </div>
                    <div className="text-2xl font-bold text-textDark">{mockStats.favoriteCategory}</div>
                    <div className="text-sm text-gray-600">Categoria preferita</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Bell className="w-8 h-8 text-green" />
                      <Settings className="w-4 h-4 text-green" />
                    </div>
                    <div className="text-2xl font-bold text-textDark">{mockStats.memberSince}</div>
                    <div className="text-sm text-gray-600">Membro dal</div>
                  </motion.div>
                </div>

                {/* Prossima ricompensa */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-rose-custom to-iceBlue p-6 rounded-xl text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Prossima ricompensa</h3>
                      <p className="text-white/90">{mockStats.nextReward}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{500 - mockStats.loyaltyPoints}</div>
                      <div className="text-sm text-white/80">punti rimanenti</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(mockStats.loyaltyPoints / 500) * 100}%` }}
                    />
                  </div>
                </motion.div>
              </div>
            )}
            {currentView === "commandes" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-textDark mb-2">
                      I Miei Ordini
                    </h1>
                    <p className="text-gray-600">Segui lo stato dei tuoi ordini recenti</p>
                  </div>
                  <Link
                    href="/boutique"
                    className="flex items-center gap-2 px-4 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Nuovo ordine</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-lg font-bold text-textDark">{order.id}</span>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === "Consegnato"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "In corso"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{order.date}</div>
                          {order.products && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {order.products.map((product, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                                >
                                  {product}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">{order.items} articolo/i</div>
                            <div className="text-xl font-bold text-textDark">{order.total.toFixed(2)} €</div>
                          </div>
                          <button className="px-4 py-2 border border-rose-custom text-rose-custom rounded-lg hover:bg-rose-custom hover:text-white transition-colors text-sm font-medium">
                            Vedi dettagli
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {mockOrders.length === 0 && (
                  <div className="text-center py-16">
                    <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-textDark mb-2">Nessun ordine</h3>
                    <p className="text-gray-600 mb-6">Inizia i tuoi acquisti per vedere i tuoi ordini qui</p>
                    <Link
                      href="/boutique"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors font-medium"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Scopri i nostri prodotti</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {currentView === "adresses" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-textDark mb-2">
                      Mes Adresses
                    </h1>
                    <p className="text-gray-600">Gérez vos adresses de livraison</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors">
                    <MapPin className="w-4 h-4" />
                    <span>Ajouter une adresse</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-rose-custom-50 to-rose-custom-100 border border-rose-custom-200 rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rose-custom rounded-full"></div>
                        <h3 className="font-semibold text-textDark">Adresse principale</h3>
                      </div>
                      <button className="text-rose-custom hover:underline text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-medium">Jean Dupont</p>
                      <p>123 Rue de la Paix</p>
                      <p>75001 Paris, France</p>
                      <p className="text-sm">+33 6 12 34 56 78</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-textDark">Adresse secondaire</h3>
                      <button className="text-rose-custom hover:underline text-sm font-medium">
                        Modifier
                      </button>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-medium">Jean Dupont</p>
                      <p>45 Avenue des Champs-Élysées</p>
                      <p>75008 Paris, France</p>
                      <p className="text-sm">+33 6 12 34 56 78</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {currentView === "profil" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-display font-bold text-textDark mb-2">
                      Mon Profil
                    </h1>
                    <p className="text-gray-600">Gérez vos informations personnelles</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-custom to-iceBlue text-white rounded-lg hover:opacity-90 transition-opacity">
                    <Settings className="w-4 h-4" />
                    <span>Paramètres</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold text-textDark mb-4">Informations personnelles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                          <input
                            type="text"
                            defaultValue="Jean"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                          <input
                            type="text"
                            defaultValue="Dupont"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            defaultValue="jean.dupont@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                          <input
                            type="tel"
                            defaultValue="+33 6 12 34 56 78"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex gap-4">
                        <button className="px-6 py-3 bg-rose-custom text-white rounded-lg hover:bg-rose-custom/90 transition-colors font-medium">
                          Sauvegarder
                        </button>
                        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                          Annuler
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold text-textDark mb-4">Préférences</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-textDark">Newsletter</div>
                            <div className="text-sm text-gray-600">Recevoir nos offres et nouveautés</div>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5 text-rose-custom rounded focus:ring-rose" />
                        </label>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-textDark">Notifications SMS</div>
                            <div className="text-sm text-gray-600">Alertes de livraison et promotions</div>
                          </div>
                          <input type="checkbox" className="w-5 h-5 text-rose-custom rounded focus:ring-rose" />
                        </label>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-rose-custom to-iceBlue rounded-xl p-6 text-white text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Jean Dupont</h3>
                      <p className="text-white/90 text-sm mb-4">Membre depuis Décembre 2025</p>
                      <div className="bg-white/20 rounded-lg px-4 py-2">
                        <div className="text-2xl font-bold">{mockStats.loyaltyPoints} points</div>
                        <div className="text-xs text-white/80">Fidélité</div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-textDark mb-4">Actions rapides</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">Moyens de paiement</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                          <Bell className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">Notifications</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
                          <Shield className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">Sécurité</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.main>
          </div>
        </div>
      )}
    </div>
  );
}
