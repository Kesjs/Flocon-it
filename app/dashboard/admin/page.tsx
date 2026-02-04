"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Users, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    validatedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const orders = await response.json();
        
        const today = new Date().toDateString();
        const todayOrders = orders.filter((order: any) => 
          new Date(order.date).toDateString() === today
        );

        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o: any) => o.status === 'En attente').length,
          validatedOrders: orders.filter((o: any) => o.status === 'Payé').length,
          totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0),
          todayOrders: todayOrders.length,
          todayRevenue: todayOrders.reduce((sum: number, order: any) => sum + order.total, 0)
        });
      }
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    }
  };

  const statCards = [
    {
      title: "Commandes totales",
      value: stats.totalOrders,
      icon: Package,
      color: "from-blue-600 to-blue-700",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "En attente",
      value: stats.pendingOrders,
      icon: Clock,
      color: "from-yellow-600 to-yellow-700",
      change: "+3",
      changeType: "neutral"
    },
    {
      title: "Validées",
      value: stats.validatedOrders,
      icon: CheckCircle,
      color: "from-green-600 to-green-700",
      change: "+8",
      changeType: "positive"
    },
    {
      title: "Revenu total",
      value: `${stats.totalRevenue.toFixed(2)} €`,
      icon: DollarSign,
      color: "from-purple-600 to-purple-700",
      change: "+23%",
      changeType: "positive"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Tableau de bord Admin
        </h1>
        <p className="text-gray-400">
          Gestion des commandes Flocon Secure Transfer
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl border border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-400' : 
                stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-xl border border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Actions rapides</h2>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/dashboard/admin/orders"
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Gérer les commandes</p>
                  <p className="text-gray-400 text-sm">Valider les paiements FST</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>

            <Link
              href="/dashboard/admin/orders?status=pending"
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Commandes en attente</p>
                  <p className="text-gray-400 text-sm">{stats.pendingOrders} à valider</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Gestion clients</p>
                  <p className="text-gray-400 text-sm">Bientôt disponible</p>
                </div>
              </div>
              <div className="text-gray-500">
                →
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistiques du jour */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-xl border border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Aujourd'hui</h2>
            <div className="text-sm text-gray-400">
              {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Commandes du jour</p>
                  <p className="text-gray-400 text-sm">Nouvelles commandes</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats.todayOrders}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Revenu du jour</p>
                  <p className="text-gray-400 text-sm">Total généré</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats.todayRevenue.toFixed(2)} €
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>Les données sont mises à jour en temps réel</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
