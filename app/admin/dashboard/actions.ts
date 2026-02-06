"use server";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Validation FST avec broadcast temps réel
export async function processFSTValidation(orderId: string) {
  console.log('🏦 Validation FST pour commande:', orderId);

  try {
    // Mettre à jour la commande
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        fst_status: 'confirmed',
        status: 'paid',
        payment_status: 'confirmed',
        payment_confirmed_at: new Date().toISOString(),
        tracking_number: `EN_PREPARATION_${orderId}_${Date.now()}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur validation FST:', error);
      return { success: false, error: error.message };
    }

    if (!order) {
      return { success: false, error: 'Commande non trouvée' };
    }

    console.log('✅ FST validé avec succès:', order.id);

    // Créer la commande dans le localStorage du client
    try {
      const clientOrder = {
        id: order.id,
        userId: order.user_id || order.user_email, // Adapter selon la structure
        date: order.created_at,
        status: 'En préparation', // Statut client après validation
        total: order.total,
        items: order.items,
        products: order.products || [],
        trackingNumber: order.tracking_number,
        shippingAddress: order.shipping_address || {
          name: order.customer_name || 'Client',
          address: order.shipping_address?.address || 'Adresse confirmée',
          city: order.shipping_address?.city || 'Ville',
          postalCode: order.shipping_address?.postal_code || '00000',
          phone: order.shipping_address?.phone || 'Téléphone'
        }
      };

      // Ajouter au localStorage du client (via un endpoint ou broadcast)
      console.log('📱 Création commande client:', clientOrder);
      
      // Ici on pourrait utiliser un système de broadcast temps réel
      // ou créer un endpoint pour que le client synchronise
      
    } catch (localError) {
      console.warn('⚠️ Erreur création commande locale:', localError);
      // Ne pas bloquer la validation
    }

    // Vider le panier de l'utilisateur pour cette commande
    try {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', order.user_id);
      
      console.log('🗑️ Panier vidé pour utilisateur:', order.user_id);
    } catch (cartError) {
      console.warn('⚠️ Erreur vidage panier:', cartError);
      // Ne pas bloquer la validation si le vidage du panier échoue
    }

    // Forcer un broadcast temps réel en faisant une mise à jour "dummy"
    await supabase
      .from('orders')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return { 
      success: true, 
      order,
      message: 'Paiement FST validé avec succès'
    };

  } catch (error) {
    console.error('💥 Erreur serveur validation FST:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// Rejet FST
export async function processFSTRejection(orderId: string, reason?: string) {
  console.log('❌ Rejet FST pour commande:', orderId, reason);

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        fst_status: 'rejected',
        status: 'cancelled',
        payment_status: 'rejected',
        rejection_reason: reason || 'Rejet manuel par l\'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur rejet FST:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      order,
      message: 'Paiement FST rejeté'
    };

  } catch (error) {
    console.error('💥 Erreur serveur rejet FST:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}
