import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Récupérer toutes les commandes
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, user_email, total, status, fst_status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération commandes:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    // Supprimer toutes les commandes
    if (orders && orders.length > 0) {
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .neq('id', 'fake-id'); // Supprimer tout (sauf un fake id)

      if (deleteError) {
        console.error('Erreur suppression commandes:', deleteError);
        return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Toutes les commandes ont été supprimées avec succès. ${orders?.length || 0} commande(s) affectée(s).`,
      deletedCount: orders?.length || 0
    });

  } catch (error) {
    console.error('Erreur réinitialisation commandes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
