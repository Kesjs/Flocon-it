import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    console.log('🔔 Webhook Stripe reçu');

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Erreur signature webhook:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Traiter les événements
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💳 Paiement réussi:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Paiement échoué:', failedPayment.id);
        break;

      default:
        console.log(`📝 Événement non traité: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Erreur webhook Stripe:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('✅ Session complétée:', session.id);

    const supabase = await createClient();
    
    if (!supabase) {
      console.error('❌ Erreur connexion Supabase');
      return;
    }

    // Extraire les métadonnées
    const metadata = session.metadata;
    if (!metadata) {
      console.error('❌ Métadonnées manquantes');
      return;
    }

    const userId = metadata.userId;
    const cartItems = JSON.parse(metadata.cart_items || '[]');
    const totalAmount = parseFloat(metadata.total_amount || '0');

    if (!userId || !cartItems.length) {
      console.error('❌ Données incomplètes:', { userId, cartItemsLength: cartItems.length });
      return;
    }

    // Créer la commande en base de données
    const orderData = {
      user_id: userId,
      items: cartItems,
      total_amount: totalAmount,
      status: 'paid',
      payment_method: 'stripe',
      stripe_session_id: session.id,
      shipping_address: {
        name: metadata.shipping_name,
        address: metadata.shipping_address,
        city: metadata.shipping_city,
        postal_code: metadata.shipping_postal_code,
        phone: metadata.shipping_phone,
      },
      created_at: new Date().toISOString(),
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur création commande:', error);
      return;
    }

    console.log('📦 Commande créée:', order.id);

    // Vider le panier de l'utilisateur
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (cartError) {
      console.error('❌ Erreur vidage panier:', cartError);
    } else {
      console.log('🧹 Panier vidé');
    }

    // Envoyer un email de confirmation (optionnel)
    // await sendConfirmationEmail(session.customer_email!, order.id);

  } catch (error) {
    console.error('❌ Erreur traitement session complétée:', error);
  }
}
