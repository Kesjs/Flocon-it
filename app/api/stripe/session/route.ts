import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id manquant' },
        { status: 400 }
      );
    }

    console.log('🔍 Récupération session Stripe:', sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details']
    });

    console.log('✅ Session récupérée:', session.id);

    return NextResponse.json(session);

  } catch (error) {
    console.error('❌ Erreur récupération session:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération de la session',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
