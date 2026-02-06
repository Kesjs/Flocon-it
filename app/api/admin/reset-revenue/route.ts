import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Récupérer toutes les commandes confirmées
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, total, fst_status')
      .eq('fst_status', 'confirmed');

    if (error) {
      console.error('Erreur récupération commandes:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    // Option 1: Mettre à jour le statut des commandes confirmées en 'archived'
    if (orders && orders.length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ fst_status: 'archived' })
        .eq('fst_status', 'confirmed');

      if (updateError) {
        console.error('Erreur mise à jour commandes:', updateError);
        // Si l'erreur est une contrainte, essayer une autre approche
        if (updateError.code === '23514') {
          return NextResponse.json({ 
            error: 'Contrainte de base de données. Veuillez exécuter la migration add_archived_status.sql dans Supabase.' 
          }, { status: 400 });
        }
        return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Compteur de revenus réinitialisé. ${orders?.length || 0} commandes archivées.`,
      archivedCount: orders?.length || 0
    });

  } catch (error) {
    console.error('Erreur réinitialisation revenus:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
