import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { corsMiddleware, handleOptions } from '@/lib/cors';
import { validateCheckoutRequest, sanitizeString } from '@/lib/validation';
import { apiRateLimit } from '@/lib/rate-limit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request) || new NextResponse(null, { status: 405 });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const rateLimitResult = apiRateLimit(ip, 'checkout');
  if (!rateLimitResult.allowed) {
    const response = NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
    response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString());
    return corsMiddleware(request, response);
  }

  try {
    console.log('Inizio creazione sessione Stripe...');
    
    // Vérifier les variables d'environnement
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY mancante');
      const response = NextResponse.json(
        { error: 'Configurazione Stripe mancante' },
        { status: 500 }
      );
      return corsMiddleware(request, response);
    }

    const body = await request.json();
    
    // Validation des inputs
    const validation = validateCheckoutRequest(body);
    if (!validation.isValid) {
      const response = NextResponse.json(
        { 
          error: 'Dati non validi', 
          details: validation.errors 
        },
        { status: 400 }
      );
      return corsMiddleware(request, response);
    }

    // Nettoyer les données
    const { cartItems, customerEmail } = {
      cartItems: body.cartItems.map((item: any) => ({
        ...item,
        name: sanitizeString(item.name),
        description: item.description ? sanitizeString(item.description) : undefined
      })),
      customerEmail: sanitizeString(body.customerEmail)
    };

    console.log('Dati validati:', { cartItems: cartItems.length, customerEmail });

    // Créer les line items pour Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.description && item.description.trim() ? item.description : `Prodotto: ${item.name}`,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convertir en centimes
      },
      quantity: item.quantity,
    }));

    console.log('Line items creati:', lineItems.length);

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        cartItems: JSON.stringify(cartItems),
      },
      // Configuration minimale - aucune validation d'adresse
      // Pas de billing_address_collection ni shipping_address_collection
      payment_method_options: {
        card: {
          // Désactiver la validation 3D Secure si nécessaire
          request_three_d_secure: 'automatic',
        },
      },
    });

    console.log('Sessione Stripe creata:', session.id);

    const response = NextResponse.json({ sessionId: session.id, url: session.url });
    return corsMiddleware(request, response);
  } catch (error) {
    console.error('Errore creazione sessione checkout:', error);
    
    // Afficher plus de détails sur l'erreur
    if (error instanceof Error) {
      console.error('Messaggio errore:', error.message);
      console.error('Stack errore:', error.stack);
    }
    
    const response = NextResponse.json(
      { 
        error: 'Errore durante la creazione della sessione di pagamento',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
    
    return corsMiddleware(request, response);
  }
}
