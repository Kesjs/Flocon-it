import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail } = await request.json();

    if (!userId && !userEmail) {
      return NextResponse.json(
        { error: 'userId ou userEmail requis' },
        { status: 400 }
      );
    }

    console.log('🔄 Synchronisation commandes pour:', userEmail || userId);

    // Récupérer les commandes depuis Supabase
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (userEmail) {
      query = query.eq('user_email', userEmail);
    } else {
      query = query.eq('user_id', userId);
    }

    const { data: supabaseOrders, error } = await query;

    if (error) {
      console.error('❌ Erreur récupération commandes:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commandes' },
        { status: 500 }
      );
    }

    if (!supabaseOrders || supabaseOrders.length === 0) {
      console.log('📭 Aucune commande trouvée');
      return NextResponse.json({
        success: true,
        orders: [],
        message: 'Aucune commande trouvée'
      });
    }

    // Transformer les commandes Supabase en format client
    const clientOrders = supabaseOrders.map(order => ({
      id: order.id,
      userId: userId,
      date: order.created_at,
      status: mapFstStatusToClientStatus(order.fst_status),
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
    }));

    console.log(`✅ ${clientOrders.length} commandes synchronisées`);

    return NextResponse.json({
      success: true,
      orders: clientOrders,
      message: `${clientOrders.length} commande(s) synchronisée(s)`
    });

  } catch (error) {
    console.error('💥 Erreur sync orders:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la synchronisation' },
      { status: 500 }
    );
  }
}

// Mapper le statut FST vers le statut client
function mapFstStatusToClientStatus(fstStatus?: string): "Livré" | "En cours" | "En préparation" | "En attente" | "Rejetée" {
  switch (fstStatus) {
    case 'confirmed':
      return 'Livré';
    case 'declared':
      return 'En préparation';
    case 'processing':
      return 'En cours';
    case 'rejected':
      return 'Rejetée';
    default:
      return 'En attente';
  }
}
