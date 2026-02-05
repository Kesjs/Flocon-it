import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { user_email, orderId, amount } = await request.json();

    // Créer une notification pour le client
    const notification = {
      id: `payment-confirmed-${Date.now()}`,
      type: 'success',
      title: 'Paiement Confirmé !',
      message: `Votre virement de ${amount}€ pour la commande #${orderId} a été validé.`,
      created_at: new Date().toISOString(),
      read: false
    };

    // Stocker la notification (vous pourriez avoir une table notifications)
    // Pour l'instant, on retourne juste les données pour le client
    
    return NextResponse.json({
      success: true,
      notification,
      redirectTo: `/dashboard/success?order_id=${orderId}&amount=${amount}`
    });

  } catch (error) {
    console.error('Erreur notification:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
