import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Diagnostic de la table orders...');
    
    // Récupérer la structure de la table
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'orders' });
    
    if (columnsError) {
      console.error('Erreur récupération colonnes:', columnsError);
      
      // Alternative: essayer de récupérer une commande pour voir sa structure
      const { data: sampleOrder, error: sampleError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        return NextResponse.json({ 
          error: 'Impossible de diagnostiquer la table orders',
          details: sampleError.message 
        }, { status: 500 });
      }
      
      if (sampleOrder && sampleOrder.length > 0) {
        const fields = Object.keys(sampleOrder[0]);
        return NextResponse.json({
          success: true,
          method: 'sample_order',
          fields: fields,
          sample: sampleOrder[0],
          recommendations: getRecommendations(fields)
        });
      }
      
      return NextResponse.json({ 
        error: 'Table orders vide ou inaccessible',
        details: 'Aucune commande trouvée pour analyser la structure'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      method: 'table_columns',
      columns: columns,
      recommendations: getRecommendations(columns.map((c: any) => c.column_name))
    });
    
  } catch (error) {
    console.error('Erreur diagnostic table:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur: ' + (error as Error).message 
    }, { status: 500 });
  }
}

function getRecommendations(fields: string[]) {
  const recommendations = [];
  
  // Vérifier les champs FST
  const fstFields = ['fst_status', 'payment_declared_at', 'payment_confirmed_at', 'tracking_number'];
  const missingFstFields = fstFields.filter(field => !fields.includes(field));
  
  if (missingFstFields.length > 0) {
    recommendations.push({
      type: 'missing_fst_fields',
      severity: 'high',
      message: `Champs FST manquants: ${missingFstFields.join(', ')}`,
      solution: 'Exécutez la migration add_fst_fields.sql'
    });
  }
  
  // Vérifier les champs d'adresse
  const addressFields = ['shipping_address', 'customer_name', 'customer_phone'];
  const missingAddressFields = addressFields.filter(field => !fields.includes(field));
  
  if (missingAddressFields.length > 0) {
    recommendations.push({
      type: 'missing_address_fields',
      severity: 'medium',
      message: `Champs adresse manquants: ${missingAddressFields.join(', ')}`,
      solution: 'Exécutez la migration add_shipping_address_fields.sql'
    });
  }
  
  // Vérifier le statut 'archived'
  if (!fields.includes('archived') && fields.includes('fst_status')) {
    recommendations.push({
      type: 'missing_archived_status',
      severity: 'medium',
      message: 'Le statut "archived" n\'existe pas dans fst_status',
      solution: 'Exécutez la migration add_archived_status.sql'
    });
  }
  
  return recommendations;
}
