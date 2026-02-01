// Synchronisation des commandes Stripe

import { OrderStorage, Order } from './order-storage';

export interface StripeSessionData {
  sessionId: string;
  customerEmail: string;
  total: number;
  items: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    country?: string;
  };
}

// Synchroniser manuellement une commande Stripe
export function syncStripeOrder(sessionData: StripeSessionData, userId: string): Order | null {
  console.log('🔄 Synchronisation manuelle de commande Stripe:', sessionData.sessionId);
  
  try {
    // Vérifier si une commande existe déjà
    const existingOrders = OrderStorage.getUserOrders(userId);
    const existingOrder = existingOrders.find(order => 
      order.id.includes(sessionData.sessionId) || 
      (order.total === sessionData.total && 
       order.items === sessionData.items &&
       Math.abs(new Date(order.date).getTime() - Date.now()) < 600000) // Commande dans les 10 dernières minutes
    );
    
    if (existingOrder) {
      console.log('✅ Commande trouvée, mise à jour:', existingOrder.id);
      
      // Mettre à jour la commande avec les vraies données
      const allOrders = JSON.parse(localStorage.getItem('flocon_orders') || '[]');
      const globalIndex = allOrders.findIndex((o: any) => o.id === existingOrder.id);
      
      if (globalIndex !== -1) {
        allOrders[globalIndex].status = 'Livré';
        allOrders[globalIndex].shippingAddress = sessionData.shippingAddress;
        localStorage.setItem('flocon_orders', JSON.stringify(allOrders));
        console.log('✅ Commande mise à jour avec succès');
        return allOrders[globalIndex];
      }
    } else {
      console.log('❌ Aucune commande trouvée pour synchronisation');
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    return null;
  }
}

// Synchroniser toutes les commandes en attente
export function syncPendingOrders(userId: string): number {
  console.log('🔄 Synchronisation des commandes en attente pour:', userId);
  
  try {
    // Récupérer toutes les commandes depuis localStorage
    const allOrdersStr = localStorage.getItem('flocon_orders');
    if (!allOrdersStr) {
      console.log('❌ Aucune commande trouvée dans localStorage');
      return 0;
    }
    
    const allOrders = JSON.parse(allOrdersStr);
    const userOrders = allOrders.filter((order: any) => order.userId === userId);
    
    console.log(`📋 ${userOrders.length} commandes utilisateur trouvées:`, userOrders.map((o: any) => ({ id: o.id, status: o.status, address: o.shippingAddress?.address })));
    
    const pendingOrders = userOrders.filter((order: any) => 
      order.status === 'En préparation' || 
      (order.shippingAddress && order.shippingAddress.address && order.shippingAddress.address.includes('En attente'))
    );
    
    console.log(`🔄 ${pendingOrders.length} commandes en attente trouvées:`, pendingOrders.map((o: any) => ({ id: o.id, address: o.shippingAddress?.address })));
    
    let syncedCount = 0;
    
    pendingOrders.forEach((order: any) => {
      console.log(`🔧 Traitement commande ${order.id}`);
      
      // Mettre à jour avec des données plus réalistes
      const orderIndex = allOrders.findIndex((o: any) => o.id === order.id);
      
      if (orderIndex !== -1) {
        // Récupérer les données du formulaire si disponibles
        const formData = localStorage.getItem('checkout-shipping-address');
        let shippingAddress = {
          name: order.shippingAddress?.name || 'Client',
          address: 'Adresse synchronisée manuellement',
          city: 'Ville synchronisée',
          postalCode: '00000',
          phone: 'Téléphone synchronisé'
        };
        
        if (formData) {
          try {
            const formAddress = JSON.parse(formData);
            shippingAddress = {
              name: formAddress.name || order.shippingAddress?.name || 'Client',
              address: formAddress.address || 'Adresse confirmée',
              city: formAddress.city || 'Ville confirmée',
              postalCode: formAddress.postalCode || '00000',
              phone: formAddress.phone || 'Téléphone confirmé'
            };
            console.log('✅ Données formulaire utilisées:', shippingAddress);
          } catch (formError) {
            console.error('❌ Erreur lecture formulaire:', formError);
          }
        }
        
        // Mettre à jour la commande
        allOrders[orderIndex].status = 'Livré';
        allOrders[orderIndex].shippingAddress = shippingAddress;
        allOrders[orderIndex].date = new Date().toISOString(); // Mettre à jour la date
        
        console.log(`✅ Commande ${order.id} mise à jour:`, {
          status: 'Livré',
          address: shippingAddress.address,
          city: shippingAddress.city
        });
        
        syncedCount++;
      }
    });
    
    // Sauvegarder les modifications
    if (syncedCount > 0) {
      localStorage.setItem('flocon_orders', JSON.stringify(allOrders));
      console.log(`💾 ${syncedCount} commandes sauvegardées dans localStorage`);
    }
    
    console.log(`🎯 ${syncedCount} commandes synchronisées au total`);
    return syncedCount;
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation des commandes en attente:', error);
    return 0;
  }
}

// Forcer la mise à jour d'une commande spécifique
export function forceUpdateOrder(orderId: string, newShippingAddress: any): boolean {
  try {
    const allOrders = JSON.parse(localStorage.getItem('flocon_orders') || '[]');
    const globalIndex = allOrders.findIndex((o: any) => o.id === orderId);
    
    if (globalIndex !== -1) {
      allOrders[globalIndex].status = 'Livré';
      allOrders[globalIndex].shippingAddress = newShippingAddress;
      localStorage.setItem('flocon_orders', JSON.stringify(allOrders));
      console.log(`✅ Commande ${orderId} mise à jour manuellement`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour manuelle:', error);
    return false;
  }
}
