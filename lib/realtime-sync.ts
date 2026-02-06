import { createClient } from '@supabase/supabase-js';
import { Order } from './order-storage';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface RealtimeOrder extends Order {
  fst_status?: 'pending' | 'declared' | 'confirmed' | 'rejected' | 'processing';
  email_sent?: boolean;
  payment_declared_at?: string;
  payment_confirmed_at?: string;
}

export class RealtimeSync {
  private userId: string;
  private channel: any = null;
  private callbacks: {
    onOrderUpdate?: (order: RealtimeOrder) => void;
    onNewOrder?: (order: RealtimeOrder) => void;
    onStatusChange?: (orderId: string, newStatus: string) => void;
  } = {};

  constructor(userId: string) {
    this.userId = userId;
  }

  // Définir les callbacks pour les événements temps réel
  on(event: 'orderUpdate' | 'newOrder' | 'statusChange', callback: Function) {
    switch (event) {
      case 'orderUpdate':
        this.callbacks.onOrderUpdate = callback as (order: RealtimeOrder) => void;
        break;
      case 'newOrder':
        this.callbacks.onNewOrder = callback as (order: RealtimeOrder) => void;
        break;
      case 'statusChange':
        this.callbacks.onStatusChange = callback as (orderId: string, newStatus: string) => void;
        break;
    }
  }

  // Démarrer la synchronisation temps réel
  start() {
    if (this.channel) {
      console.log('🔄 Channel déjà actif');
      return;
    }

    console.log('🚀 Démarrage synchronisation temps réel pour:', this.userId);

    this.channel = supabase
      .channel(`user-orders-${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `user_email=eq.${this.getUserIdEmail()}`
        },
        (payload) => {
          console.log('📦 Nouvelle commande détectée:', payload.new);
          const order = payload.new as RealtimeOrder;
          
          // Synchroniser avec localStorage
          this.syncToLocal(order);
          
          // Notifier le callback
          if (this.callbacks.onNewOrder) {
            this.callbacks.onNewOrder(order);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_email=eq.${this.getUserIdEmail()}`
        },
        (payload) => {
          console.log('🔄 Mise à jour commande détectée:', payload.new);
          const updated = payload.new as RealtimeOrder;
          const previous = payload.old as RealtimeOrder;
          
          // Synchroniser avec localStorage
          this.syncToLocal(updated);
          
          // Notifier les callbacks
          if (this.callbacks.onOrderUpdate) {
            this.callbacks.onOrderUpdate(updated);
          }
          
          if (this.callbacks.onStatusChange && previous.status !== updated.status) {
            this.callbacks.onStatusChange(updated.id, updated.status);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Synchronisation temps réel active');
        } else if (status === 'TIMED_OUT') {
          console.log('⏰ Timeout synchronisation');
        }
      });
  }

  // Arrêter la synchronisation
  stop() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      console.log('🛑 Synchronisation temps réel arrêtée');
    }
  }

  // Synchroniser une commande depuis Supabase vers localStorage
  private syncToLocal(order: RealtimeOrder) {
    if (typeof window === 'undefined') return;

    try {
      const ORDERS_KEY = 'flocon_orders';
      const existingOrders = localStorage.getItem(ORDERS_KEY);
      const allOrders: Order[] = existingOrders ? JSON.parse(existingOrders) : [];
      
      // Convertir le statut FST vers le statut client
      const clientOrder: Order = {
        id: order.id,
        userId: this.userId,
        date: order.created_at || order.date,
        status: this.mapFstStatusToClientStatus(order.fst_status),
        total: order.total,
        items: order.items,
        products: order.products || [],
        shippingAddress: order.shippingAddress || {
          name: 'Client',
          address: 'Adresse à mettre à jour',
          city: 'Ville',
          postalCode: '00000',
          phone: 'Téléphone'
        }
      };

      // Vérifier si la commande existe déjà
      const existingIndex = allOrders.findIndex(o => o.id === order.id);
      
      if (existingIndex >= 0) {
        // Mettre à jour la commande existante
        allOrders[existingIndex] = clientOrder;
        console.log('🔄 Commande mise à jour localement:', order.id);
      } else {
        // Ajouter la nouvelle commande
        allOrders.push(clientOrder);
        console.log('➕ Nouvelle commande ajoutée localement:', order.id);
      }

      localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
      
      // Déclencher un événement personnalisé pour notifier le dashboard
      window.dispatchEvent(new CustomEvent('orderUpdated', { 
        detail: { order: clientOrder, type: existingIndex >= 0 ? 'update' : 'new' }
      }));

    } catch (error) {
      console.error('❌ Erreur synchronisation locale:', error);
    }
  }

  // Mapper le statut FST vers le statut client
  private mapFstStatusToClientStatus(fstStatus?: string): Order['status'] {
    switch (fstStatus) {
      case 'confirmed':
        return 'Livré';
      case 'declared':
        return 'En préparation';
      case 'processing':
        return 'En cours';
      case 'rejected':
        return 'En attente';
      default:
        return 'En attente';
    }
  }

  // Récupérer l'email de l'utilisateur (pour le filtre Supabase)
  private getUserIdEmail(): string {
    // Cette fonction devrait être améliorée pour récupérer le vrai email
    // Pour l'instant, on utilise une approximation
    const userStr = localStorage.getItem('supabase.auth.token');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.user?.email || '';
      } catch {
        return '';
      }
    }
    return '';
  }

  // Synchronisation manuelle complète
  async fullSync() {
    console.log('🔄 Lancement synchronisation complète...');
    
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', this.getUserIdEmail())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur récupération commandes:', error);
        return false;
      }

      if (orders) {
        orders.forEach(order => this.syncToLocal(order as RealtimeOrder));
        console.log(`✅ ${orders.length} commandes synchronisées`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Erreur synchronisation complète:', error);
      return false;
    }
  }

  // Nettoyer les ressources
  cleanup() {
    this.stop();
    this.callbacks = {};
  }
}
