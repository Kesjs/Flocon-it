import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { orderId, trackingNumber } = await request.json();

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'ID de commande et numéro de suivi requis' },
        { status: 400 }
      );
    }

    console.log('📦 Ajout numéro de suivi:', orderId, trackingNumber);

    // Vérifier l'authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header manquant ou invalide' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier le token avec Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Erreur auth:', authError);
      return NextResponse.json(
        { error: 'Utilisateur invalide' },
        { status: 401 }
      );
    }

    // Mettre à jour le numéro de suivi de la commande
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour suivi:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du numéro de suivi', details: error.message },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Numéro de suivi ajouté avec succès:', order.id);

    return NextResponse.json({
      success: true,
      message: 'Numéro de suivi ajouté avec succès',
      order
    });

  } catch (error) {
    console.error('💥 Erreur serveur add-tracking:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout du suivi' },
      { status: 500 }
    );
  }
}
