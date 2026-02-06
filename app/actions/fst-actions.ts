'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { redirect } from 'next/navigation';

interface Order {
  id: string;
  user_email: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  fst_status?: 'pending' | 'declared' | 'confirmed' | 'rejected';
  payment_declared_at?: string;
  payment_confirmed_at?: string;
  created_at: string;
  updated_at: string;
  shipping_address?: any;
  billing_address?: any;
  items?: any;
  stripe_payment_intent_id?: string;
  stripe_checkout_session_id?: string;
}

export async function declarePayment(orderId: string) {
  console.log('🚀 Server Action: declarePayment', orderId);
  
  if (!orderId) {
    return { success: false, error: 'ID de commande manquant' };
  }

  try {
    // Vérifier que Supabase est disponible
    if (!supabaseAdmin) {
      console.log('❌ Supabase non disponible côté serveur');
      return { success: false, error: 'Service Supabase indisponible' };
    }
    
    // Récupérer l'utilisateur côté serveur (plus fiable)
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();
    
    console.log('👤 Server user:', user?.email);
    console.log('❌ Server auth error:', authError);
    
    if (authError || !user || !user.email) {
      console.log('🚫 Pas d\'utilisateur côté serveur');
      return { success: false, error: 'Vous devez être connecté' };
    }

    // Vérifier que la commande existe et appartient à l'utilisateur
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_email', user.email)
      .single();

    console.log('📦 Server order:', order);
    console.log('❌ Server order error:', orderError);

    if (orderError || !order) {
      console.log('❌ Commande non trouvée côté serveur');
      return { success: false, error: 'Commande non trouvée' };
    }

    // Vérifier que le paiement n'a pas déjà été déclaré
    const typedOrder = order as Order;
    if (typedOrder.fst_status && typedOrder.fst_status !== 'pending') {
      console.log('❌ Paiement déjà déclaré côté serveur');
      return { success: false, error: 'Paiement déjà déclaré' };
    }

    // Déclarer le paiement
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        fst_status: 'declared',
        payment_declared_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('user_email', user.email)
      .select()
      .single();

    console.log('✅ Server updated order:', updatedOrder);
    console.log('❌ Server update error:', updateError);

    if (updateError) {
      console.log('❌ Erreur mise à jour côté serveur:', updateError);
      return { success: false, error: 'Erreur lors de la déclaration' };
    }

    console.log(`✅ Paiement déclaré côté serveur pour ${orderId} par ${user.email}`);
    
    return { success: true, order: updatedOrder };
    
  } catch (error) {
    console.error('💥 Erreur inattendue:', error);
    return { success: false, error: 'Erreur serveur inattendue' };
  }
}
