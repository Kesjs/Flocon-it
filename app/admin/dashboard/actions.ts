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
