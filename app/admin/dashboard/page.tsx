"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, ShoppingBag, BarChart, Check, X, Clock, TrendingUp, Activity, RefreshCw, Menu, ShoppingCart, DollarSign, AlertCircle, Mail, Copy, Send } from "lucide-react";
import { supabaseAdminClient } from '@/lib/supabase-admin-client';
import { processFSTValidation, processFSTRejection } from './actions';
import AdminHeader from '../components/AdminHeader';
import { NotificationProvider, NotificationPanel, useNotifications } from '@/components/admin/NotificationSystem';

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
  email_sent?: boolean;
  tracking_number?: string; // Numéro de suivi du colis
  email_sent_at?: string;
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
  fst_status?: 'pending' | 'declared' | 'confirmed' | 'rejected' | 'processing' | 'archived';
  created_at: string;
  items: number;
}

// Types

// Composant interne pour utiliser le contexte de notifications
function CommandCenterWithNotifications() {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'virements' | 'users' | 'orders'>('virements');
  const [fstPayments, setFstPayments] = useState<FSTPayment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [liveSync, setLiveSync] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<FSTPayment | null>(null);
  const [emailContent, setEmailContent] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            totalRevenue: prev.totalRevenue + (inserted.fst_status === 'confirmed' ? Number(inserted.total) || 0 : 0)
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
            addNotification({
              type: 'new_order',
              title: 'Nouvelle Déclaration FST',
              message: `Un client vient de déclarer un virement de ${updated.total}€`,
              action: {
                label: 'Voir la commande',
                onClick: () => {
                  setActiveTab('virements');
                  setMobileMenuOpen(false);
                }
              },
              data: { orderId: updated.id, userEmail: updated.user_email, total: updated.total }
            });
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
          const wasConfirmed = previous?.fst_status === 'confirmed';
          const isConfirmed = updated?.fst_status === 'confirmed';

          setStats(prev => ({
            ...prev,
            pendingTransfers: prev.pendingTransfers + (!wasDeclared && isDeclared ? 1 : 0) + (wasDeclared && !isDeclared ? -1 : 0),
            totalRevenue: prev.totalRevenue + 
              (wasConfirmed && !isConfirmed ? -prevTotal : 0) + 
              (!wasConfirmed && isConfirmed ? nextTotal : 0) +
              (wasConfirmed && isConfirmed && Number.isFinite(prevTotal) && Number.isFinite(nextTotal) ? (nextTotal - prevTotal) : 0)
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
          const newUser = payload.new as User;
          
          addNotification({
            type: 'new_user',
            title: 'Nouvel utilisateur inscrit',
            message: `${newUser.email} vient de s'inscrire sur la plateforme`,
            data: { userEmail: newUser.email, userId: newUser.id }
          });
          
          setUsers(prev => [newUser, ...prev.slice(0, 9)]); // Garder les 10 derniers
          setStats(prev => ({ ...prev, newUsersToday: prev.newUsersToday + 1 }));
        }
      )
      .subscribe();

    return () => {
      supabaseAdminClient.removeChannel(channel);
    };
  }, [addNotification]);

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
      // Exclure les commandes archivées du calcul du revenu
      const confirmedRevenue = ordersData ? 
        ordersData.orders?.filter((order: Order) => 
          order.fst_status === 'confirmed'
        )
          .reduce((sum: number, order: Order) => sum + order.total, 0) || 0 : 0;
      
      const totalRevenue = ordersData ? 
        ordersData.orders?.filter((order: Order) => 
          order.fst_status !== 'archived' && 
          order.fst_status !== 'rejected'
        )
          .reduce((sum: number, order: Order) => sum + order.total, 0) || 0 : 0;
      
      const activeUsers = usersData ? 
        usersData.users?.filter((user: User) => 
          user.last_sign_in_at && 
          new Date(user.last_sign_in_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length || 0 : 0;

      const pendingTransfers = paymentsData ? 
        paymentsData.payments?.filter((p: FSTPayment) => p.fst_status === 'declared').length || 0 : 0;

      setStats({ totalRevenue: confirmedRevenue, activeUsers, pendingTransfers, newUsersToday: 0 });

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    console.log('🔄 Rafraîchissement des données du dashboard...');
    setIsRefreshing(true);
    try {
      // Forcer un rechargement complet en ignorant le cache
      const [paymentsRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/fst-payments', { cache: 'no-store' }),
        fetch('/api/admin/users', { cache: 'no-store' }),
        fetch('/api/admin/orders', { cache: 'no-store' })
      ]);

      // Mettre à jour les états avec les nouvelles données
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setFstPayments(paymentsData.payments || []);
        console.log(`✅ ${paymentsData.payments?.length || 0} paiements chargés`);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
        console.log(`✅ ${usersData.users?.length || 0} utilisateurs chargés`);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
        console.log(`✅ ${ordersData.orders?.length || 0} commandes chargées`);
        
        // Recalculer les stats avec les nouvelles données
        const confirmedRevenue = ordersData.orders?.filter((order: Order) => 
          order.fst_status === 'confirmed'
        ).reduce((sum: number, order: Order) => sum + order.total, 0) || 0;
        
        setStats(prev => ({ ...prev, totalRevenue: confirmedRevenue }));
        console.log(`💰 Revenu confirmé mis à jour: ${confirmedRevenue.toFixed(2)}€`);
      }

      // Appeler fetchData pour s'assurer que tout est synchronisé
      await fetchData();
      
      addNotification({
        type: 'success',
        title: 'Données actualisées',
        message: 'Le dashboard a été rafraîchi avec les dernières données'
      });
      
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
      addNotification({
        type: 'error',
        title: 'Erreur de rafraîchissement',
        message: 'Impossible de charger les dernières données'
      });
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

        // Notification de confirmation
        addNotification({
          type: 'payment_confirmed',
          title: 'Paiement Confirmé',
          message: `Le paiement de ${result.order?.total || 0}€ pour la commande ${orderId} a été validé avec succès`,
        });
        
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
        addNotification({
          type: 'error',
          title: 'Erreur de Validation',
          message: `Impossible de valider le paiement pour la commande ${orderId}: ${result.error}`
        });
      }
    } catch (error) {
      console.error('Erreur confirmation FST:', error);
      addNotification({
        type: 'error',
        title: 'Erreur Système',
        message: 'Une erreur est survenue lors de la validation du paiement'
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const handleRejectFST = async (orderId: string) => {
    const reason = prompt('⚠️ Raison du rejet du paiement FST pour ' + orderId + ' ?\n\nCette action est irréversible.');
    
    if (reason === null) {
      return; // L'utilisateur a annulé
    }

    if (!reason || reason.trim() === '') {
      alert('⚠️ Veuillez spécifier une raison pour le rejet.');
      return;
    }

    setConfirmingId(orderId);
    
    try {
      const result = await processFSTRejection(orderId, reason.trim());
      
      if (result.success) {
        // Mettre à jour l'état local
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

        // Notification de rejet
        addNotification({
          type: 'payment_rejected',
          title: 'Paiement Rejeté',
          message: `Le paiement pour la commande ${orderId} a été rejeté. Raison: ${reason.trim()}`,
        });
        
        // Animation de rejet
        const element = document.getElementById(`payment-${orderId}`);
        if (element) {
          element.classList.add('bg-red-50', 'border-red-200');
          setTimeout(() => {
            element.classList.remove('bg-red-50', 'border-red-200');
          }, 2000);
        }

        await refreshData();
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur de Rejet',
          message: `Impossible de rejeter le paiement pour la commande ${orderId}: ${result.error}`
        });
      }
    } catch (error) {
      console.error('Erreur rejet FST:', error);
      addNotification({
        type: 'error',
        title: 'Erreur Système',
        message: 'Une erreur est survenue lors du rejet du paiement'
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const handleAddTracking = async (orderId: string) => {
    const trackingNumber = prompt(`📦 Numéro de suivi pour la commande ${orderId} ?\n\nExemple: 6A123456789`);
    
    if (trackingNumber === null) {
      return; // L'utilisateur a annulé
    }

    if (trackingNumber.trim() === '') {
      alert('Le numéro de suivi ne peut pas être vide');
      return;
    }

    setConfirmingId(orderId);
    
    try {
      const response = await fetch('/api/admin/add-tracking', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ orderId, trackingNumber: trackingNumber.trim() })
      });

      const result = await response.json();

      if (result.success) {
        // Mettre à jour l'état local
        setFstPayments(prev => 
          prev.map(p => p.id === orderId 
            ? { ...p, tracking_number: trackingNumber.trim() }
            : p
          )
        );
        
        addNotification({
          type: 'success',
          title: 'Numéro de suivi ajouté',
          message: `Le numéro de suivi ${trackingNumber.trim()} a été ajouté à la commande ${orderId}`
        });

        // Animation de succès
        const element = document.getElementById(`payment-${orderId}`);
        if (element) {
          element.classList.add('bg-purple-50', 'border-purple-200');
          setTimeout(() => {
            element.classList.remove('bg-purple-50', 'border-purple-200');
          }, 2000);
        }
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur ajout suivi:', error);
      alert('Erreur lors de l\'ajout du numéro de suivi');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleShowEmail = (payment: FSTPayment) => {
    setSelectedPayment(payment);
    
    // Générer le template d'email
    const isConfirmed = payment.fst_status === 'confirmed';
    const template = isConfirmed 
      ? `✅ Votre commande ${payment.id} a été validée !

Cher ${payment.user_email.split('@')[0]},

Nous avons le plaisir de vous informer que votre commande ${payment.id} d'un montant de ${payment.total.toFixed(2)}€ a été validée.

Votre commande est maintenant en préparation et vous sera expédiée dans les plus brefs délais.

Vous pouvez suivre l'état de votre commande directement sur votre espace client.

Merci pour votre confiance !

Cordialement,
L'équipe Flocon`
      : `❌ Information concernant votre commande ${payment.id}

Cher ${payment.user_email.split('@')[0]},

Suite à l'examen de votre commande ${payment.id} d'un montant de ${payment.total.toFixed(2)}€, nous devons vous informer que le paiement n'a pas pu être validé.

Raison : [Préciser la raison du rejet]

Si vous pensez qu'il s'agit d'une erreur, merci de nous contacter à contact@flocon.paris en indiquant votre numéro de commande.

Nous restons à votre disposition pour toute information complémentaire.

Cordialement,
L'équipe Flocon`;
    
    setEmailContent(template);
    setEmailModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    alert('📋 Email copié dans le presse-papiers !');
  };

  const markEmailAsSent = () => {
    if (!selectedPayment) return;
    
    setFstPayments(prev => 
      prev.map(p => p.id === selectedPayment.id 
        ? { ...p, email_sent: true, email_sent_at: new Date().toISOString() }
        : p
      )
    );
    
    setEmailModalOpen(false);
    setSelectedPayment(null);
    setEmailContent('');
    alert('✅ Email marqué comme envoyé !');
  };

  const handleDiagnoseOrdersTable = async () => {
    try {
      console.log('🔍 Diagnostic de la table orders...');
      addNotification({
        type: 'info',
        title: 'Diagnostic en cours',
        message: 'Analyse de la structure de la table orders...'
      });

      const response = await fetch('/api/admin/diagnose-orders-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      console.log('📊 Résultat diagnostic table:', result);
      
      if (result.success) {
        let message = `Structure analysée avec ${result.fields?.length || result.columns?.length || 0} champs trouvés.`;
        
        if (result.recommendations && result.recommendations.length > 0) {
          message += ` ${result.recommendations.length} recommandation(s) trouvée(s).`;
          
          result.recommendations.forEach((rec: any) => {
            console.log(`⚠️ ${rec.type}: ${rec.message}`);
            if (rec.severity === 'high') {
              addNotification({
                type: 'error',
                title: 'Problème Critique',
                message: rec.message,
                data: { solution: rec.solution }
              });
            } else {
              addNotification({
                type: 'warning',
                title: 'Amélioration Requise',
                message: rec.message,
                data: { solution: rec.solution }
              });
            }
          });
        } else {
          addNotification({
            type: 'success',
            title: 'Structure OK',
            message: 'La table orders est correctement configurée.'
          });
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur Diagnostic',
          message: result.error || 'Impossible d\'analyser la table orders'
        });
      }
    } catch (error) {
      console.error('Erreur diagnostic table:', error);
      addNotification({
        type: 'error',
        title: 'Erreur Système',
        message: 'Une erreur est survenue lors du diagnostic'
      });
    }
  };

  const handleCheckArchivedStatus = async () => {
    try {
      console.log('🔍 Vérification du statut archived...');
      addNotification({
        type: 'info',
        title: 'Diagnostic en cours',
        message: 'Vérification du statut archived dans la base de données...'
      });

      const response = await fetch('/api/admin/check-archived-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      console.log('📊 Résultat diagnostic:', result);
      
      if (result.exists) {
        addNotification({
          type: 'success',
          title: 'Statut Archived OK',
          message: 'Le statut archived est correctement configuré dans la base de données.'
        });
      } else if (result.needsMigration) {
        addNotification({
          type: 'warning',
          title: 'Migration Requise',
          message: 'Le statut archived n\'existe pas. Veuillez exécuter la migration SQL manuellement.',
          data: { 
            sql: result.sql,
            instructions: '1. Allez dans votre dashboard Supabase\n2. Cliquez sur "SQL Editor"\n3. Copiez-collez le code SQL ci-dessus\n4. Exécutez la requête'
          }
        });
        
        // Afficher le SQL dans une alerte pour copier-coller facile
        if (result.sql) {
          alert('🔧 Migration Required\n\nCopiez ce SQL dans votre dashboard Supabase:\n\n' + result.sql);
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur Diagnostic',
          message: result.error || 'Impossible de vérifier le statut archived'
        });
      }
    } catch (error) {
      console.error('Erreur diagnostic:', error);
      addNotification({
        type: 'error',
        title: 'Erreur Système',
        message: 'Une erreur est survenue lors du diagnostic'
      });
    }
  };

  const handleResetRevenue = async () => {
    if (!confirm('⚠️ Réinitialiser le compteur de revenus ?\n\nCette action va archiver toutes les commandes confirmées et remettre le compteur de revenus à 0.\n\nCette action est irréversible.')) {
      return;
    }

    try {
      console.log('🔄 Début réinitialisation des revenus...');
      addNotification({
        type: 'info',
        title: 'Réinitialisation en cours',
        message: 'Archivage des commandes confirmées...'
      });

      const response = await fetch('/api/admin/reset-revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      console.log('📊 Résultat reset-revenue:', result);
      
      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Revenus Réinitialisés',
          message: result.message,
          data: { 
            archivedCount: result.archivedCount,
            usedArchivedStatus: result.usedArchivedStatus
          }
        });
        
        // Forcer un rafraîchissement complet des données
        console.log('🔄 Forcer le rafraîchissement des données...');
        await refreshData();
        
        // Attendre un peu pour s'assurer que tout est bien synchronisé
        setTimeout(async () => {
          await refreshData();
        }, 1000);
        
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur de Réinitialisation',
          message: result.error || 'Impossible de réinitialiser les revenus'
        });
      }
    } catch (error) {
      console.error('Erreur réinitialisation revenus:', error);
      addNotification({
        type: 'error',
        title: 'Erreur Système',
        message: 'Une erreur est survenue lors de la réinitialisation des revenus'
      });
    }
  };

  const handleResetOrders = async () => {
    if (!confirm('⚠️ Réinitialiser toutes les commandes ?\n\nCette action va supprimer TOUTES les commandes (confirmées, rejetées, en attente).\n\nCette action est IRRÉVERSIBLE et affectera tous les utilisateurs.\n\nÊtes-vous absolument certain ?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/reset-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Commandes Réinitialisées',
          message: result.message,
          data: { deletedCount: result.deletedCount }
        });
        await refreshData();
      } else {
        addNotification({
          type: 'error',
          title: 'Erreur de Réinitialisation',
          message: result.error || 'Impossible de réinitialiser les commandes'
        });
      }
    } catch (error) {
      console.error('Erreur réinitialisation commandes:', error);
      addNotification({
        type: 'error',
        title: 'Erreur Système',
        message: 'Une erreur est survenue lors de la réinitialisation des commandes'
      });
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

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <h1 className="text-lg font-black text-slate-900">Admin</h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <>
                  <X size={20} className="text-slate-900" />
                </>
              ) : (
                <>
                  <Menu size={20} className="text-slate-900" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar - Desktop (fixed) + Mobile (overlay) */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block lg:w-20 bg-white border-r border-slate-200/60 lg:min-h-screen p-4 fixed lg:relative inset-0 z-50 lg:inset-auto`}>
          {/* Close button for mobile */}
          <div className="lg:hidden absolute top-4 right-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-900" />
            </button>
          </div>
          
          <div className="space-y-8 h-full flex flex-col">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield size={20} className="text-white" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                ADMIN
              </div>
            </div>
            
            <nav className="space-y-6 flex-1">
              <button
                onClick={() => { setActiveTab('virements'); setMobileMenuOpen(false); }}
                className={`w-full p-3 rounded-xl transition-all ${
                  activeTab === 'virements' 
                    ? 'bg-slate-900 text-white' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Shield size={20} className="mx-auto" />
              </button>
              
              <button
                onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                className={`w-full p-3 rounded-xl transition-all ${
                  activeTab === 'users' 
                    ? 'bg-slate-900 text-white' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Users size={20} className="mx-auto" />
              </button>
              
              <button
                onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
            {/* Bouton Réinitialiser Commandes - conteneur séparé pour mobile */}
            <div className="order-first sm:order-auto w-full sm:w-auto mb-4 sm:mb-0">
              <button
                onClick={handleResetOrders}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all active:scale-95"
              >
                <AlertCircle className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Réinitialiser Commandes</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
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

              <button
                onClick={handleResetRevenue}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all active:scale-95"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Réinitialiser Revenus</span>
              </button>

              <button
                onClick={handleCheckArchivedStatus}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all active:scale-95"
              >
                <AlertCircle className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Diagnostic</span>
              </button>

              <button
                onClick={handleDiagnoseOrdersTable}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all active:scale-95"
              >
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Table</span>
              </button>

              <button
                onClick={handleResetOrders}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all active:scale-95"
              >
                <AlertCircle className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Réinitialiser Commandes</span>
              </button>
            </div>
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-3 lg:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Revenus
                  </div>
                  <div className="text-lg lg:text-2xl font-black text-slate-900">
                    {stats.totalRevenue.toFixed(2)}€
                  </div>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 lg:w-5 lg:h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-3 lg:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Actifs
                  </div>
                  <div className="text-lg lg:text-2xl font-black text-slate-900">
                    {stats.activeUsers}
                  </div>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <Activity className="w-3 h-3 lg:w-5 lg:h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-3 lg:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    En Attente
                  </div>
                  <div className="text-lg lg:text-2xl font-black text-slate-900">
                    {stats.pendingTransfers}
                  </div>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-orange-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <Clock className="w-3 h-3 lg:w-5 lg:h-5 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-3 lg:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Nouveaux
                  </div>
                  <div className="text-lg lg:text-2xl font-black text-slate-900">
                    {stats.newUsersToday}
                  </div>
                </div>
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <Users className="w-3 h-3 lg:w-5 lg:h-5 text-purple-600" />
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
                        className="bg-slate-50 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-200/60"
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
                            
                            {/* Debug - Afficher le statut pour vérification */}
                            <div className="text-xs text-gray-500 mb-2">
                              Debug: fst_status = "{payment.fst_status}"
                            </div>

                            {/* Boutons d'action pour les commandes en attente */}
                            {payment.fst_status === 'pending' && (
                              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                                <button
                                  onClick={() => handleMarkAsDeclared(payment.id)}
                                  disabled={confirmingId === payment.id}
                                  className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {confirmingId === payment.id ? '...' : 'DÉCLARER'}
                                </button>
                                <button
                                  onClick={() => handleShowEmail(payment)}
                                  className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  EMAIL
                                </button>
                              </div>
                            )}

                            {/* Boutons d'action pour les statuts déclarés */}
                            {payment.fst_status === 'declared' && (
                              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                                <button
                                  onClick={() => handleConfirmFST(payment.id)}
                                  disabled={confirmingId === payment.id}
                                  className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {confirmingId === payment.id ? '...' : 'VALIDER'}
                                </button>
                                <button
                                  onClick={() => handleRejectFST(payment.id)}
                                  disabled={confirmingId === payment.id}
                                  className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {confirmingId === payment.id ? '...' : 'REJETER'}
                                </button>
                                <button
                                  onClick={() => handleShowEmail(payment)}
                                  className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  EMAIL
                                </button>
                              </div>
                            )}

                            {/* Boutons d'action pour les commandes confirmées */}
                            {payment.fst_status === 'confirmed' && (
                              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 sm:ml-4">
                                <button
                                  onClick={() => handleAddTracking(payment.id)}
                                  disabled={confirmingId === payment.id}
                                  className="px-3 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {confirmingId === payment.id ? '...' : 'SUIVI'}
                                </button>
                                <button
                                  onClick={() => handleShowEmail(payment)}
                                  className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  EMAIL
                                </button>
                              </div>
                            )}
                            
                            {confirmingId === payment.id ? (
                              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-purple-600">
                                {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            ) : (
                              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-purple-600">
                                {new Date(payment.created_at).toLocaleDateString('fr-FR')}
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

      {/* Modal d'envoi d'email */}
      {emailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">
                  📧 Envoyer un email à {selectedPayment.user_email.split('@')[0]}
                </h3>
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Commande {selectedPayment.id} • {selectedPayment.total.toFixed(2)}€ • 
                Statut: {selectedPayment.fst_status === 'confirmed' ? 'Validée' : 'Rejetée'}
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  📧 Destinataire
                </label>
                <input
                  type="text"
                  value={selectedPayment.user_email}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  📋 Sujet de l'email
                </label>
                <input
                  type="text"
                  value={selectedPayment.fst_status === 'confirmed' 
                    ? `✅ Votre commande ${selectedPayment.id} a été validée`
                    : `❌ Information concernant votre commande ${selectedPayment.id}`
                  }
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ✏️ Contenu de l'email (modifiable)
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Personnalisez le contenu de l'email..."
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-blue-800">
                  💡 <strong>Instructions :</strong> Copiez ce contenu et envoyez-le manuellement depuis votre boîte mail.
                  Vous pouvez modifier le contenu avant de le copier.
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  📋 Prêt à copier-coller dans votre email
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEmailModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    📋 Copier l'email
                  </button>
                  <button
                    onClick={markEmailAsSent}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    ✅ Marquer comme envoyé
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Composant principal avec le provider
export default function CommandCenter() {
  return (
    <NotificationProvider>
      <CommandCenterWithNotifications />
    </NotificationProvider>
  );
}
