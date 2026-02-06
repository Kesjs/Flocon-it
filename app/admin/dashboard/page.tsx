"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, ShoppingBag, BarChart, Check, X, Clock, TrendingUp, Activity, RefreshCw } from "lucide-react";
import { supabaseAdminClient } from '@/lib/supabase-admin-client';
import { processFSTValidation, processFSTRejection } from './actions';
import AdminHeader from '../components/AdminHeader';

// Types
interface FSTPayment {
  id: string;
  user_email: string;
  total: number;
  payment_declared_at?: string;
  fst_status: 'pending' | 'declared' | 'confirmed' | 'rejected' | 'processing';
  created_at: string;
  items: number;
  products: string[];
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface Order {
  id: string;
  user_email: string;
  total: number;
  status: string;
  created_at: string;
  items: number;
}

// Types

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState<'virements' | 'users' | 'orders'>('virements');
  const [fstPayments, setFstPayments] = useState<FSTPayment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newDeclarationAlert, setNewDeclarationAlert] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [liveSync, setLiveSync] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    pendingTransfers: 0,
    newUsersToday: 0
  });

  // Realtime listener pour FST
  useEffect(() => {
    if (!liveSync) return;

    const channel = supabaseAdminClient
      .channel('orders-live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const inserted = payload.new as any;

          setOrders(prev => {
            const exists = prev.some(o => o.id === inserted.id);
            if (exists) return prev;
            return [inserted as Order, ...prev].slice(0, 100);
          });

          setStats(prev => ({
            ...prev,
            totalRevenue: prev.totalRevenue + (Number(inserted.total) || 0)
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          const updated = payload.new as any;
          const previous = payload.old as any;

          setOrders(prev => {
            const exists = prev.some(o => o.id === updated.id);
            if (!exists) return [updated as Order, ...prev].slice(0, 100);
            return prev.map(o => (o.id === updated.id ? { ...o, ...(updated as Order) } : o));
          });

          const wasDeclared = previous?.fst_status === 'declared';
          const isDeclared = updated?.fst_status === 'declared';

          if (!wasDeclared && isDeclared) {
            setNewDeclarationAlert(updated.id);
            // L'alerte reste indéfiniment jusqu'à ce que l'admin la ferme

            try {
              const audio = new Audio('/notification.mp3');
              audio.volume = 0.3;
              audio.play().catch(() => {});
            } catch (e) {
            }
          }

          setFstPayments(prev => {
            const existing = prev.find(p => p.id === updated.id);
            
            // Garder TOUS les paiements dans la liste (y compris confirmed/rejected)
            if (existing) {
              return prev.map(p => (p.id === updated.id ? ({ ...p, ...(updated as FSTPayment) }) : p));
            }

            // Ajouter le nouveau paiement s'il n'existe pas
            return [updated as FSTPayment, ...prev];
          });

          const prevTotal = Number(previous?.total);
          const nextTotal = Number(updated?.total);

          setStats(prev => ({
            ...prev,
            pendingTransfers: prev.pendingTransfers + (!wasDeclared && isDeclared ? 1 : 0) + (wasDeclared && !isDeclared ? -1 : 0),
            totalRevenue: prev.totalRevenue + (Number.isFinite(prevTotal) && Number.isFinite(nextTotal) ? (nextTotal - prevTotal) : 0)
          }));
        }
      )
      .subscribe();

    return () => {
      supabaseAdminClient.removeChannel(channel);
    };
  }, [liveSync]);

  // Realtime listener pour nouveaux utilisateurs
  useEffect(() => {
    const channel = supabaseAdminClient
      .channel('new-users')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auth.users'
        },
        (payload) => {
          console.log(' Nouvel utilisateur:', payload.new);
          setUsers(prev => [payload.new as User, ...prev.slice(0, 9)]); // Garder les 10 derniers
          setStats(prev => ({ ...prev, newUsersToday: prev.newUsersToday + 1 }));
        }
      )
      .subscribe();

    return () => {
      supabaseAdminClient.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/fst-payments'),
        fetch('/api/admin/users'),
        fetch('/api/admin/orders')
      ]);

      // Stocker les réponses JSON pour éviter l'erreur "Body already consumed"
      let paymentsData = null;
      let usersData = null;
      let ordersData = null;

      if (paymentsRes.ok) {
        paymentsData = await paymentsRes.json();
        setFstPayments(paymentsData.payments || []);
      }

      if (usersRes.ok) {
        usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (ordersRes.ok) {
        ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      // Calculer les stats avec les données stockées
      const totalRevenue = ordersData ? 
        ordersData.orders?.reduce((sum: number, order: Order) => sum + order.total, 0) || 0 : 0;
      
      const activeUsers = usersData ? 
        usersData.users?.filter((user: User) => 
          user.last_sign_in_at && 
          new Date(user.last_sign_in_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length || 0 : 0;

      const pendingTransfers = paymentsData ? 
        paymentsData.payments?.filter((p: FSTPayment) => p.fst_status === 'declared').length || 0 : 0;

      setStats({ totalRevenue, activeUsers, pendingTransfers, newUsersToday: 0 });

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMarkAsDeclared = async (orderId: string) => {
    if (!confirm(`⚠️ Marquer la commande ${orderId} comme déclarée ?\n\nLe client pourra alors voir les instructions de virement.`)) {
      return;
    }

    setConfirmingId(orderId);
    
    try {
      const response = await fetch('/api/admin/mark-declared', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Mettre à jour l'état local
        setFstPayments(prev => 
          prev.map(p => p.id === orderId 
            ? { ...p, fst_status: 'declared' as const, payment_declared_at: new Date().toISOString() }
            : p
          )
        );
        
        setStats(prev => ({ 
          ...prev, 
          pendingTransfers: prev.pendingTransfers + 1
        }));

        await refreshData();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur marquage déclaré:', error);
      alert('Erreur lors du marquage de la commande');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleConfirmFST = async (orderId: string) => {
    if (!confirm(`⚠️ Confirmer la validation du paiement FST pour ${orderId} ?\n\nCette action est irréversible.`)) {
      return;
    }

    setConfirmingId(orderId);
    
    try {
      const result = await processFSTValidation(orderId);
      
      if (result.success) {
        // Mettre à jour l'état local
        setFstPayments(prev => 
          prev.map(p => p.id === orderId 
            ? { ...p, fst_status: 'confirmed' as const }
            : p
          )
        );
        
        setStats(prev => ({ 
          ...prev, 
          pendingTransfers: Math.max(0, prev.pendingTransfers - 1),
          totalRevenue: prev.totalRevenue + (result.order?.total || 0)
        }));
        
        // Animation de succès
        const element = document.getElementById(`payment-${orderId}`);
        if (element) {
          element.classList.add('bg-green-50', 'border-green-200');
          setTimeout(() => {
            element.classList.remove('bg-green-50', 'border-green-200');
          }, 2000);
        }

        await refreshData();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur confirmation FST:', error);
      alert('Erreur lors de la validation du paiement');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleRejectFST = async (orderId: string) => {
    const reason = prompt('Raison du rejet (optionnel):');
    
    setConfirmingId(orderId);
    
    try {
      const result = await processFSTRejection(orderId, reason || undefined);
      
      if (result.success) {
        setFstPayments(prev => 
          prev.map(p => p.id === orderId 
            ? { ...p, fst_status: 'rejected' as const }
            : p
          )
        );
        
        setStats(prev => ({ 
          ...prev, 
          pendingTransfers: Math.max(0, prev.pendingTransfers - 1)
        }));

        await refreshData();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur rejet FST:', error);
      alert('Erreur lors du rejet du paiement');
    } finally {
      setConfirmingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      {/* Header Admin */}
      <AdminHeader />

      {/* Alert visuelle pour nouvelle déclaration */}
      {newDeclarationAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="font-black text-sm uppercase tracking-wider">
            NOUVELLE DÉCLARATION
          </span>
          <button
            onClick={() => setNewDeclarationAlert(null)}
            className="ml-2 p-1 hover:bg-emerald-600 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-20 bg-white border-r border-slate-200/60 min-h-screen p-4">
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield size={20} className="text-white" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                ADMIN
              </div>
            </div>
            
            <nav className="space-y-6">
              <button
                onClick={() => setActiveTab('virements')}
                className={`w-full p-3 rounded-xl transition-all ${
                  activeTab === 'virements' 
                    ? 'bg-slate-900 text-white' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Shield size={20} className="mx-auto" />
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full p-3 rounded-xl transition-all ${
                  activeTab === 'users' 
                    ? 'bg-slate-900 text-white' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Users size={20} className="mx-auto" />
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full p-3 rounded-xl transition-all ${
                  activeTab === 'orders' 
                    ? 'bg-slate-900 text-white' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ShoppingBag size={20} className="mx-auto" />
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 ${
                  isRefreshing
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Rafraîchir</span>
              </button>

              <button
                onClick={() => setLiveSync(v => !v)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all active:scale-95 ${
                  liveSync
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${liveSync ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Live</span>
              </button>
            </div>
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Total Revenus
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.totalRevenue.toFixed(2)}€
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Utilisateurs Actifs
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.activeUsers}
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Virements En Attente
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.pendingTransfers}
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-orange-600" />
                </div>
              </div>
            </div>

            {/* NOUVEAU: Derniers Inscrits */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Nouveaux Inscrits
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {stats.newUsersToday}
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Section Derniers Inscrits (en haut) */}
          {users.length > 0 && (
            <div className="mb-6 bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between mb-3 min-w-[300px]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900">
                  👥 Derniers Inscrits
                </h3>
                <div className="text-[10px] font-black text-purple-600 uppercase tracking-wider whitespace-nowrap">
                  TEMPS RÉEL
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex-shrink-0 bg-purple-50 rounded-xl p-3 border border-purple-200 min-w-[140px]">
                    <div className="font-semibold text-slate-900 text-sm truncate">
                      {user.email.split('@')[0]}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-purple-600">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main View */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-slate-200/60 p-4 sm:p-6 overflow-x-auto">
              <div className="flex space-x-6 sm:space-x-8 min-w-max">
                <button
                  onClick={() => setActiveTab('virements')}
                  className={`pb-3 border-b-2 transition-all ${
                    activeTab === 'virements'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.15em]">
                    Virements FST
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className={`pb-3 border-b-2 transition-all ${
                    activeTab === 'users'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.15em]">
                    Utilisateurs
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`pb-3 border-b-2 transition-all ${
                    activeTab === 'orders'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.15em]">
                    Commandes
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 overflow-x-auto">
              {/* Virements FST Tab */}
              {activeTab === 'virements' && (
                <div className="space-y-4">
                  <AnimatePresence>
                    {fstPayments.map((payment) => (
                      <motion.div
                        key={payment.id}
                        id={`payment-${payment.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/60"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                  CLIENT
                                </div>
                                <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                                  {payment.user_email.split('@')[0]}
                                </div>
                              </div>
                              <div className="hidden sm:block text-slate-400">•</div>
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                  MONTANT
                                </div>
                                <div className="font-black text-xl text-slate-900">
                                  {payment.total.toFixed(2)}€
                                </div>
                              </div>
                              <div className="hidden sm:block text-slate-400">•</div>
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                  DATE
                                </div>
                                <div className="text-sm text-slate-600">
                                  {payment.payment_declared_at ? 
                                    new Date(payment.payment_declared_at).toLocaleDateString('fr-FR') :
                                    new Date(payment.created_at).toLocaleDateString('fr-FR')
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Badge de statut */}
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              payment.fst_status === 'declared' ? 'bg-orange-100 text-orange-700' :
                              payment.fst_status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              payment.fst_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              payment.fst_status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {payment.fst_status === 'declared' ? 'DÉCLARÉ' :
                               payment.fst_status === 'processing' ? 'VÉRIFICATION' :
                               payment.fst_status === 'confirmed' ? 'VALIDÉ' :
                               payment.fst_status === 'rejected' ? 'REJETÉ' :
                               'EN ATTENTE'}
                            </div>
                            
                            {confirmingId === payment.id ? (
                              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                                <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">
                                  TRAITEMENT...
                                </span>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                {/* Bouton pour marquer comme déclaré (si en attente) */}
                                {payment.fst_status === 'pending' && (
                                  <button
                                    onClick={() => handleMarkAsDeclared(payment.id)}
                                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all active:scale-95"
                                    title="Marquer comme déclaré"
                                  >
                                    <Clock size={16} />
                                  </button>
                                )}
                                
                                {/* Boutons confirmer/rejeter (si déclaré) */}
                                {payment.fst_status === 'declared' && (
                                  <>
                                    <button
                                      onClick={() => handleConfirmFST(payment.id)}
                                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all active:scale-95"
                                      title="Confirmer le paiement"
                                    >
                                      <Check size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleRejectFST(payment.id)}
                                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all active:scale-95"
                                      title="Rejeter le paiement"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {fstPayments.length === 0 && (
                    <div className="text-center py-12">
                      <Shield size={48} className="mx-auto text-slate-300 mb-4" />
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        Aucun virement en attente
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-slate-900">{user.email}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                          Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        {user.last_sign_in_at ? 
                          `Actif ${new Date(user.last_sign_in_at).toLocaleDateString('fr-FR')}` : 
                          'Jamais connecté'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-slate-900">#{order.id}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                          {order.user_email} • {order.items} articles
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-lg text-slate-900">{order.total.toFixed(2)}€</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
