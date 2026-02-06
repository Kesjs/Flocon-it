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
    // D'abord, récupérer la commande actuelle pour voir sa structure
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('❌ Erreur récupération commande:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!existingOrder) {
      return { success: false, error: 'Commande non trouvée' };
    }

    console.log('📋 Commande actuelle:', existingOrder);

    // Préparer l'objet de mise à jour avec uniquement les champs qui existent
    const updateData: any = {
      fst_status: 'confirmed',
      updated_at: new Date().toISOString()
    };

    // Ajouter les champs uniquement s'ils existent dans la table
    if (existingOrder.hasOwnProperty('status')) {
      updateData.status = 'paid';
    }
    
    if (existingOrder.hasOwnProperty('payment_status')) {
      updateData.payment_status = 'confirmed';
    }
    
    if (existingOrder.hasOwnProperty('payment_confirmed_at')) {
      updateData.payment_confirmed_at = new Date().toISOString();
    }
    
    if (existingOrder.hasOwnProperty('tracking_number')) {
      updateData.tracking_number = `EN_PREPARATION_${orderId}_${Date.now()}`;
    }

    console.log('🔄 Données de mise à jour:', updateData);

    // Mettre à jour la commande avec les champs valides
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur validation FST:', error);
      return { success: false, error: error.message };
    }

    if (!order) {
      return { success: false, error: 'Commande non trouvée après mise à jour' };
    }

    console.log('✅ FST validé avec succès:', order.id);

    // Créer la commande pour le client (avec fallbacks si champs manquent)
    try {
      const clientOrder = {
        id: order.id,
        userId: order.user_id || order.user_email,
        date: order.created_at,
        status: 'En préparation',
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

      console.log('📱 Création commande client:', clientOrder);
      
    } catch (localError) {
      console.warn('⚠️ Erreur création commande locale:', localError);
    }

    // Vider le panier de l'utilisateur (avec fallback si user_id n'existe pas)
    try {
      const userId = order.user_id || order.user_email;
      if (userId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId);
        
        console.log('🗑️ Panier vidé pour utilisateur:', userId);
      }
    } catch (cartError) {
      console.warn('⚠️ Erreur vidage panier:', cartError);
    }

    // Forcer un broadcast temps réel
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
