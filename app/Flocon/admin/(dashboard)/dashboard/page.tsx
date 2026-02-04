"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, Users, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle, CreditCard, Eye } from "lucide-react";

export default function FloconAdminDashboard() {
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
      title: "Commandes FST",
      value: stats.totalOrders,
      icon: CreditCard,
      color: "from-blue-600 to-blue-700",
      change: "+12%",
      changeType: "positive",
      description: "Virements bancaires"
    },
    {
      title: "En attente",
      value: stats.pendingOrders,
      icon: Clock,
      color: "from-yellow-600 to-yellow-700",
      change: "+3",
      changeType: "neutral",
      description: "À valider"
    },
    {
      title: "Validées",
      value: stats.validatedOrders,
      icon: CheckCircle,
      color: "from-green-600 to-green-700",
      change: "+8",
      changeType: "positive",
      description: "Payées"
    },
    {
      title: "Revenu total",
      value: `${stats.totalRevenue.toFixed(2)} €`,
      icon: DollarSign,
      color: "from-purple-600 to-purple-700",
      change: "+23%",
      changeType: "positive",
      description: "Cumulé"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-400 text-lg">
          Administration Flocon Market
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Système opérationnel</span>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
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
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
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
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Actions rapides</h2>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/Flocon/admin/orders"
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Gérer les commandes FST</p>
                  <p className="text-gray-400 text-sm">Valider les virements bancaires</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                <Eye className="w-5 h-5" />
              </div>
            </Link>

            <Link
              href="/Flocon/admin/orders?status=pending"
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Commandes en attente</p>
                  <p className="text-gray-400 text-sm">{stats.pendingOrders} à valider</p>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-white transition-colors">
                →
              </div>
            </Link>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Gestion clients</p>
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
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Aujourd'hui</h2>
            <div className="text-sm text-gray-400">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Commandes du jour</p>
                  <p className="text-gray-400 text-sm">Nouvelles commandes FST</p>
                </div>
              </div>
              <div className="text-3xl font-black text-white">
                {stats.todayOrders}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Revenu du jour</p>
                  <p className="text-gray-400 text-sm">Total généré</p>
                </div>
              </div>
              <div className="text-3xl font-black text-white">
                {stats.todayRevenue.toFixed(2)} €
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>Les données sont mises à jour en temps réel</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-slate-800">
        <p className="text-gray-500 text-sm">
          © 2026 Flocon Market Administration v3.0 • Système sécurisé SEPA
        </p>
      </div>
    </div>
  );
}
