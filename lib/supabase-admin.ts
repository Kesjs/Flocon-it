import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client Supabase avec droits administrateur
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types pour les commandes FST
export type FSTStatus = 'pending' | 'declared' | 'confirmed' | 'processing';

export interface OrderFST {
  id: string;
  user_email: string;
  status: string;
  total: number;
  items: number;
  products: string[];
  stripe_session_id?: string;
  payment_status: string;
  fst_status?: FSTStatus;
  payment_declared_at?: string;
  created_at: string;
  updated_at: string;
}

// Fonctions utilitaires pour les commandes FST
export const getFSTOrders = async (status?: FSTStatus) => {
  let query = supabaseAdmin
    .from('orders')
    .select('*')
    .order('payment_declared_at', { ascending: false });

  if (status) {
    query = query.eq('fst_status', status);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Erreur récupération commandes FST:', error);
    return [];
  }
  
  return data as OrderFST[];
};

export const updateOrderFSTStatus = async (
  orderId: string, 
  status: FSTStatus,
  userEmail?: string
) => {
  let query = supabaseAdmin
    .from('orders')
    .update({ 
      fst_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (userEmail) {
    query = query.eq('user_email', userEmail);
  }

  const { data, error } = await query.select().single();
  
  if (error) {
    console.error('Erreur mise à jour statut FST:', error);
    throw error;
  }
  
  return data as OrderFST;
};

export const declarePayment = async (
  orderId: string, 
  userEmail: string
) => {
  try {
    console.log('🔍 Déclaration paiement pour:', orderId, userEmail);
    
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        fst_status: 'declared',
        payment_declared_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('user_email', userEmail)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur déclaration paiement:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Paiement déclaré avec succès:', data);
    return { success: true, order: data };
    
  } catch (error) {
    console.error('💥 Erreur catch declarePayment:', error);
    return { success: false, error: 'Erreur serveur' };
  }
};
