import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, declarePayment } from '@/lib/supabase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande manquant' },
        { status: 400 }
      );
    }

    // Récupérer et vérifier le token d'authentification
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Non autorisé - Token manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier le token avec Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user || !user.email) {
      console.error('Erreur auth:', authError);
      return NextResponse.json(
        { error: 'Utilisateur invalide ou email manquant' },
        { status: 401 }
      );
    }

    console.log(`✅ Utilisateur authentifié: ${user.email}`);

    // Vérifier que la commande existe et appartient à l'utilisateur
    console.log('🔍 Recherche commande:', orderId, 'pour utilisateur:', user.email);
    
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_email', user.email)
      .single();

    console.log('📦 Order:', order);
    console.log('❌ Order Error:', orderError);

    if (orderError || !order) {
      console.log('❌ Commande non trouvée');
      return NextResponse.json(
        { error: 'Commande non trouvée ou non autorisée' },
        { status: 404 }
      );
    }

    // Vérifier que le paiement n'a pas déjà été déclaré
    if (order.fst_status && order.fst_status !== 'pending') {
      console.log('❌ Paiement déjà déclaré, statut:', order.fst_status);
      return NextResponse.json(
        { error: 'Paiement déjà déclaré' },
        { status: 400 }
      );
    }

    // Déclarer le paiement
    const updatedOrder = await declarePayment(orderId, user.email);

    console.log(`✅ Paiement déclaré pour commande ${orderId} par ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Paiement déclaré avec succès',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Erreur API déclaration paiement:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
