import { motion } from "framer-motion";
import { TrendingUp, Package, CreditCard, Calendar, ArrowUpRight, ArrowDownRight, Users, ShoppingCart } from "lucide-react";
import { Order } from "@/lib/order-storage";
import { User } from "@supabase/supabase-js";
import { UnifiedOrderManager } from "@/lib/unified-order-manager";

interface StatsSectionProps {
  orders: Order[];
  user: User | null;
  orderManager?: UnifiedOrderManager | null;
}

export function StatsSection({ orders, user }: StatsSectionProps) {
  // Calculer les statistiques
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  
  // Commandes par statut
  const deliveredOrders = orders.filter(o => o.status === 'Livré').length;
  const preparingOrders = orders.filter(o => o.status === 'En préparation').length;
  const processingOrders = orders.filter(o => o.status === 'En cours').length;
  
  // Commandes par type
  const stripeOrders = orders.filter(o => o.id.includes('cs_test_')).length;
  const testOrders = orders.filter(o => o.id.includes('CMD-') && !o.id.includes('cs_test_')).length;
  
  // Calculer le mois dernier (simulation)
  const thisMonthOrders = orders.filter(o => {
    const orderDate = new Date(o.date);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  }).length;
  
  const lastMonthOrders = Math.max(0, thisMonthOrders - Math.floor(Math.random() * 3)); // Simulation

  const stats = [
    {
      title: "Total Commandes",
      value: totalOrders.toString(),
      change: thisMonthOrders - lastMonthOrders,
      changeText: `vs mois dernier`,
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Dépensé",
      value: `${totalSpent.toFixed(2)} €`,
      change: totalSpent > 0 ? 12.5 : 0,
      changeText: "vs mois dernier",
      icon: CreditCard,
      color: "bg-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Panier Moyen",
      value: `${averageOrderValue.toFixed(2)} €`,
      change: averageOrderValue > 0 ? 8.2 : 0,
      changeText: "vs mois dernier",
      icon: ShoppingCart,
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Taux de Livraison",
      value: totalOrders > 0 ? `${Math.round((deliveredOrders / totalOrders) * 100)}%` : "0%",
      change: deliveredOrders > 0 ? 5.1 : 0,
      changeText: "vs mois dernier",
      icon: TrendingUp,
      color: "bg-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  const statusStats = [
    { label: "Livré", value: deliveredOrders, color: "bg-green-500", percentage: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0 },
    { label: "En préparation", value: preparingOrders, color: "bg-blue-500", percentage: totalOrders > 0 ? (preparingOrders / totalOrders) * 100 : 0 },
    { label: "En cours", value: processingOrders, color: "bg-yellow-500", percentage: totalOrders > 0 ? (processingOrders / totalOrders) * 100 : 0 }
  ];

  const typeStats = [
    { label: "Stripe", value: stripeOrders, color: "bg-purple-500", percentage: totalOrders > 0 ? (stripeOrders / totalOrders) * 100 : 0 },
    { label: "Test", value: testOrders, color: "bg-green-500", percentage: totalOrders > 0 ? (testOrders / totalOrders) * 100 : 0 }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de vos commandes et achats
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color} text-white`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.changeText}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
          <div className="space-y-4">
            {statusStats.map((stat, index) => (
              <div key={stat.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  <span className="text-sm text-gray-600">{stat.value} commande{stat.value > 1 ? 's' : ''}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`${stat.color} h-2 rounded-full`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Type</h3>
          <div className="space-y-4">
            {typeStats.map((stat, index) => (
              <div key={stat.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  <span className="text-sm text-gray-600">{stat.value} commande{stat.value > 1 ? 's' : ''}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`${stat.color} h-2 rounded-full`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white rounded-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order, index) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  order.status === 'Livré' ? 'bg-green-500' :
                  order.status === 'En préparation' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Commande #{order.id.slice(-8)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(order.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{order.total.toFixed(2)} €</p>
                <p className="text-xs text-gray-600">{order.status}</p>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Aucune activité récente</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
