import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems, customerEmail, metadata, shippingAddress } = body;

    console.log('🛒 Création session Stripe:', { cartItems: cartItems.length, customerEmail });

    // Valider les données
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Calculer le montant total
    const totalAmount = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity * 100); // Stripe utilise les centimes
    }, 0);

    // Ajouter les frais de livraison (5€)
    const shippingAmount = 500; // 5.00€ en centimes
    const finalAmount = totalAmount + shippingAmount;

    // Créer les line items pour Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.description || `Produit de qualité - ${item.name}`,
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.id.toString(),
            category: item.category || 'default'
          }
        },
        unit_amount: Math.round(item.price * 100), // Convertir en centimes
      },
      quantity: item.quantity,
    }));

    // Ajouter les frais de livraison
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Livraison',
          description: 'Livraison standard en France métropolitaine',
        },
        unit_amount: shippingAmount,
      },
      quantity: 1,
    });

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        ...metadata,
        shipping_name: shippingAddress?.name || customerEmail,
        shipping_address: shippingAddress?.address || 'Adresse non spécifiée',
        shipping_city: shippingAddress?.city || 'Paris',
        shipping_postal_code: shippingAddress?.postalCode || '75001',
        shipping_phone: shippingAddress?.phone || '+33 6 00 00 00 00',
        cart_items: JSON.stringify(cartItems),
        total_amount: (finalAmount / 100).toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['FR'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expiration 30 minutes
    });

    console.log('✅ Session Stripe créée:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('❌ Erreur création session Stripe:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de la session de paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
