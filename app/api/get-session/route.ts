import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Vérifier si Stripe est configuré avant de l'initialiser
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
}) : null;

export async function GET(request: NextRequest) {
  // Vérifier si Stripe est configuré
  if (!stripe) {
    console.error('Stripe n\'est pas configuré - STRIPE_SECRET_KEY manquant');
    return NextResponse.json(
      { error: 'Service de paiement non disponible' },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 });
    }

    // Récupérer les détails de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    });

    if (!session) {
      return NextResponse.json({ error: 'Session non trouvée' }, { status: 404 });
    }

    // Extraire les informations pertinentes
    const orderDetails = {
      id: session.id,
      status: session.payment_status === 'paid' ? 'Payée' : 'En attente',
      email: session.customer_details?.email || session.customer_email,
      total: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      paymentStatus: session.payment_status,
      created: session.created,
      items: session.line_items?.data?.map(item => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total ? item.amount_total / 100 : 0,
      })) || [],
      metadata: session.metadata,
    };

    return NextResponse.json({ orderDetails });
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails de la commande' },
      { status: 500 }
    );
  }
}
