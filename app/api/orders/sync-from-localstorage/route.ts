import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      );
    }

    console.log('🔄 Synchronisation commande depuis localStorage:', orderId);

    // Récupérer la commande depuis localStorage (simulé)
    // Dans un vrai cas, on aurait besoin d'un endpoint pour récupérer les données du client
    // Pour l'instant, on va juste marquer la commande comme existante avec les données de base
    
    // Vérifier si la commande existe déjà dans Supabase
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (existingOrder) {
      console.log('✅ Commande existe déjà dans Supabase:', orderId);
      return NextResponse.json({ order: existingOrder });
    }

    // Si la commande n'existe pas, la créer avec les données minimales
    // Les données d'adresse devront être fournies par le client
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_email: 'client@flocon-boutique.com', // Sera mis à jour plus tard
        total: 0, // Sera mis à jour plus tard
        items: 0, // Sera mis à jour plus tard
        products: [],
        payment_status: 'pending',
        fst_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur création commande:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la commande', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Commande créée dans Supabase:', order.id);
    return NextResponse.json({ order });

  } catch (error) {
    console.error('💥 Erreur serveur sync:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la synchronisation' },
      { status: 500 }
    );
  }
}
