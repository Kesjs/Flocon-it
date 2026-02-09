import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID mancante' }, { status: 400 });
    }

    // Récupérer les détails de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    });

    if (!session) {
      return NextResponse.json({ error: 'Sessione non trovata' }, { status: 404 });
    }

    // Extraire les informations pertinentes
    const orderDetails = {
      id: session.id,
      status: session.payment_status === 'paid' ? 'Pagata' : 'In attesa',
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
    console.error('Errore durante il recupero della sessione:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei dettagli dell\'ordine' },
      { status: 500 }
    );
  }
}
