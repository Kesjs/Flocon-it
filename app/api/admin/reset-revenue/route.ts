import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Début réinitialisation des revenus...');
    
    // D'abord, vérifier si le statut 'archived' existe en essayant de l'utiliser
    let archivedStatusExists = true;
    
    // Récupérer toutes les commandes confirmées
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, total, fst_status')
      .eq('fst_status', 'confirmed');

    if (error) {
      console.error('Erreur récupération commandes:', error);
      return NextResponse.json({ error: 'Erreur serveur: ' + error.message }, { status: 500 });
    }

    console.log(`📊 ${orders?.length || 0} commandes confirmées trouvées`);

    // Option 1: Essayer d'archiver les commandes confirmées
    if (orders && orders.length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ fst_status: 'archived' })
        .eq('fst_status', 'confirmed');

      if (updateError) {
        console.error('Erreur mise à jour commandes:', updateError);
        archivedStatusExists = false;
        
        // Si le statut 'archived' n'existe pas, utiliser une autre approche
        if (updateError.code === '23514' || updateError.message?.includes('invalid input value')) {
          console.log('⚠️ Le statut "archived" n\'existe pas, utilisation du statut "rejected"');
          
          // Alternative: marquer comme 'rejected' avec un préfixe spécial
          const { error: fallbackError } = await supabase
            .from('orders')
            .update({ 
              fst_status: 'rejected',
              // Ajouter un champ personnalisé pour marquer l'archivage
              metadata: { archived_at: new Date().toISOString(), archived_from: 'confirmed' }
            })
            .eq('fst_status', 'confirmed');
            
          if (fallbackError) {
            console.error('Erreur fallback:', fallbackError);
            return NextResponse.json({ 
              error: 'Impossible d\'archiver les commandes. Veuillez exécuter la migration add_archived_status.sql dans Supabase.' 
            }, { status: 400 });
          }
        } else {
          return NextResponse.json({ error: 'Erreur mise à jour: ' + updateError.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: archivedStatusExists 
        ? `Compteur de revenus réinitialisé. ${orders?.length || 0} commandes archivées avec le statut 'archived'.`
        : `Compteur de revenus réinitialisé. ${orders?.length || 0} commandes marquées comme 'rejected' (statut 'archived' non disponible).`,
      archivedCount: orders?.length || 0,
      usedArchivedStatus: archivedStatusExists
    });

  } catch (error) {
    console.error('Erreur réinitialisation revenus:', error);
    return NextResponse.json({ error: 'Erreur serveur: ' + (error as Error).message }, { status: 500 });
  }
}
