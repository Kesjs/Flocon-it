"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, MapPin, User, LogOut, Menu, X, ShoppingBag, Heart, TrendingUp, Calendar, CreditCard, Settings, Bell, Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type View = "commandes" | "adresses" | "profil";

interface Order {
  id: string;
  date: string;
  status: "Livré" | "En cours";
  total: number;
  items: number;
}

const mockOrders: Order[] = [
  {
    id: "CMD-001",
    date: "15 Jan 2026",
    status: "Livré",
    total: 149.97,
    items: 3,
  },
  {
    id: "CMD-002",
    date: "20 Jan 2026",
    status: "En cours",
    total: 89.99,
    items: 2,
  },
  {
    id: "CMD-003",
    date: "22 Jan 2026",
    status: "En cours",
    total: 59.99,
    items: 1,
  },
];

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
    { id: "commandes" as View, label: "Mes Commandes", icon: Package },
    { id: "adresses" as View, label: "Adresses", icon: MapPin },
    { id: "profil" as View, label: "Profil", icon: User },
  ];

  return (
    <div className="pt-28 min-h-screen bg-cream">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose"></div>
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
                Mon Compte
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
                        ? "bg-rose text-white"
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
              <span className="font-medium">Déconnexion</span>
            </button>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white rounded-lg shadow-md p-6 lg:p-8"
          >
            {currentView === "commandes" && (
              <div>
                <h1 className="text-3xl font-display font-bold text-textDark mb-6">
                  Mes Commandes
                </h1>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-textDark">
                          Commande
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-textDark">
                          Date
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-textDark">
                          Statut
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-textDark">
                          Articles
                        </th>
                        <th className="text-right py-4 px-4 font-semibold text-textDark">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span className="font-medium text-textDark">{order.id}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{order.date}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === "Livré"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{order.items} article(s)</td>
                          <td className="py-4 px-4 text-right font-semibold text-textDark">
                            {order.total.toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {mockOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aucune commande pour le moment</p>
                    <Link
                      href="/"
                      className="text-rose hover:underline font-medium"
                    >
                      Découvrir nos produits
                    </Link>
                  </div>
                )}
              </div>
            )}

            {currentView === "adresses" && (
              <div>
                <h1 className="text-3xl font-display font-bold text-textDark mb-6">
                  Mes Adresses
                </h1>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-textDark">Adresse de livraison</h3>
                      <button className="text-rose hover:underline text-sm">
                        Modifier
                      </button>
                    </div>
                    <p className="text-gray-600">
                      123 Rue de la Paix<br />
                      75001 Paris<br />
                      France
                    </p>
                  </div>
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:border-rose hover:text-rose transition-colors">
                    + Ajouter une nouvelle adresse
                  </button>
                </div>
              </div>
            )}

            {currentView === "profil" && (
              <div>
                <h1 className="text-3xl font-display font-bold text-textDark mb-6">
                  Mon Profil
                </h1>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      defaultValue="Jean Dupont"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="jean.dupont@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textDark mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+33 6 12 34 56 78"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none"
                    />
                  </div>
                  <button className="bg-textDark text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium">
                    Enregistrer les modifications
                  </button>
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
