import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      );
    }

    // Récupérer la commande avec l'ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !order) {
      console.error('❌ Commande non trouvée:', id);
      
      // Récupérer les commandes disponibles pour le debugging
      const { data: availableOrders } = await supabase
        .from('orders')
        .select('id, user_email, total, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      return NextResponse.json(
        { 
          error: 'Commande non trouvée',
          requestedId: id,
          availableOrders: availableOrders || []
        },
        { status: 404 }
      );
    }

    console.log('✅ Commande trouvée:', order.id);
    return NextResponse.json({ order });

  } catch (error) {
    console.error('💥 Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
