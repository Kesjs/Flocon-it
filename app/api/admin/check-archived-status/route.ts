import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Vérification du statut archived...');
    
    // Essayer d'insérer une commande de test avec le statut 'archived'
    const testOrder = {
      user_email: 'test@example.com',
      total: 0,
      fst_status: 'archived',
      items: 0,
      products: [],
      created_at: new Date().toISOString()
    };

    const { data: testData, error: testError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select('id')
      .single();

    if (testError) {
      console.log('❌ Le statut archived n\'existe pas:', testError.message);
      
      // Si l'erreur indique que le statut n'est pas valide, on doit ajouter la contrainte
      if (testError.code === '23514' || testError.message?.includes('invalid input value')) {
        console.log('🔧 Tentative d\'ajout du statut archived...');
        
        // Essayer d'exécuter la migration SQL
        try {
          const { error: migrationError } = await supabase.rpc('add_archived_status');
          
          if (migrationError) {
            console.log('⚠️ Migration RPC échouée, retour des instructions SQL manuelles');
            return NextResponse.json({
              exists: false,
              needsMigration: true,
              sql: `
-- Copiez-collez ce SQL dans votre dashboard Supabase:
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_fst_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_fst_status_check 
CHECK (fst_status IN ('pending', 'declared', 'confirmed', 'processing', 'rejected', 'archived'));
              `.trim()
            });
          }
          
          console.log('✅ Migration réussie');
          return NextResponse.json({ exists: true, needsMigration: false });
          
        } catch (rpcError) {
          console.error('Erreur RPC:', rpcError);
          return NextResponse.json({
            exists: false,
            needsMigration: true,
            error: 'Le statut archived n\'existe pas. Veuillez exécuter manuellement la migration SQL.'
          });
        }
      }
      
      return NextResponse.json({ 
        exists: false, 
        error: testError.message 
      });
    }

    // Si l'insertion a réussi, supprimer la commande de test
    if (testData?.id) {
      await supabase.from('orders').delete().eq('id', testData.id);
    }

    console.log('✅ Le statut archived existe');
    return NextResponse.json({ exists: true, needsMigration: false });

  } catch (error) {
    console.error('Erreur vérification statut archived:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur: ' + (error as Error).message 
    }, { status: 500 });
  }
}
