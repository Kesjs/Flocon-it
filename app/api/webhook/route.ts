import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { corsMiddleware, handleOptions } from '@/lib/cors';
import { webhookRateLimit } from '@/lib/rate-limit';

// Vérifier si Stripe est configuré avant de l'initialiser
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
}) : null;

// Vérifier si Supabase est configuré avant de l'initialiser
const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request) || new NextResponse(null, { status: 405 });
}

export async function POST(request: NextRequest) {
  // Vérifier si Stripe est configuré
  if (!stripe) {
    console.error('Stripe n\'est pas configuré - STRIPE_SECRET_KEY manquant');
    const response = NextResponse.json(
      { error: 'Service de paiement non disponible' },
      { status: 503 }
    );
    return corsMiddleware(request, response);
  }

  // Rate limiting basé sur l'IP
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const rateLimitResult = webhookRateLimit(ip);
  if (!rateLimitResult.allowed) {
    const response = NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
    response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString());
    return corsMiddleware(request, response);
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    const response = NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
    return corsMiddleware(request, response);
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        console.log('Session expired:', expiredSession.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    const response = NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    return corsMiddleware(request, response);
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // Vérifier si les services sont configurés
    if (!stripe) {
      console.error('Stripe n\'est pas configuré');
      throw new Error('Stripe non configuré');
    }

    if (!supabase) {
      console.error('Supabase n\'est pas configuré');
      throw new Error('Supabase non configuré');
    }

    // Récupérer les détails complets de la session
    const sessionWithDetails = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details'],
    });

    // Récupérer les métadonnées du panier
    const cartItems = JSON.parse(session.metadata?.cartItems || '[]');
    
    // Créer une commande dans la base de données
    const orderData = {
      id: `CMD-${Date.now()}`,
      user_email: session.customer_email || session.customer_details?.email,
      status: 'En préparation',
      total: session.amount_total ? session.amount_total / 100 : 0, // Convertir en euros
      items: cartItems.length,
      products: cartItems.map((item: any) => item.name),
      stripe_session_id: session.id,
      payment_status: session.payment_status,
      created_at: new Date().toISOString(),
    };

    // Insérer la commande dans Supabase
    const { error } = await supabase
      .from('orders')
      .insert([orderData]);

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    console.log('Order created successfully:', orderData.id);

    // Envoyer l'email de confirmation
    await sendConfirmationEmail({
      email: orderData.user_email || 'email@example.com',
      orderId: orderData.id,
      sessionId: session.id,
      total: orderData.total,
      items: cartItems,
      status: 'Payée',
      created_at: orderData.created_at,
    });

  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

async function sendConfirmationEmail(orderData: {
  email: string;
  orderId: string;
  sessionId: string;
  total: number;
  items: any[];
  status: string;
  created_at: string;
}) {
  try {
    // Pour l'instant, on va juste logger l'email
    // Plus tard, vous pouvez intégrer un service d'email comme Resend, SendGrid, etc.
    
    console.log('📧 ENVOI EMAIL DE CONFIRMATION');
    console.log('=====================================');
    console.log(`À: ${orderData.email}`);
    console.log(`Commande: ${orderData.orderId}`);
    console.log(`Session: ${orderData.sessionId}`);
    console.log(`Total: ${orderData.total} €`);
    console.log(`Statut: ${orderData.status}`);
    console.log(`Date: ${new Date(orderData.created_at).toLocaleDateString('fr-FR')}`);
    console.log('Articles:');
    orderData.items.forEach((item: any, index: number) => {
      console.log(`  ${index + 1}. ${item.name} x${item.quantity} - ${item.price} €`);
    });
    console.log('=====================================');
    
    // TODO: Intégrer un vrai service d'email
    // Exemple avec Resend:
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: orderData.email,
      subject: 'Confirmation de votre commande - Flocon',
      html: generateOrderEmailHTML(orderData),
    });
    */
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

function generateOrderEmailHTML(orderData: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmation de commande</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Paiement réussi !</h1>
          <h2>Merci pour votre commande</h2>
        </div>
        
        <div class="order-details">
          <h3>Détails de la commande</h3>
          <p><strong>Numéro:</strong> ${orderData.orderId}</p>
          <p><strong>Date:</strong> ${new Date(orderData.created_at).toLocaleDateString('fr-FR')}</p>
          <p><strong>Statut:</strong> ${orderData.status === 'Payée' ? 'Payée' : 'En attente'}</p>
          
          <h4>Articles commandés:</h4>
          ${orderData.items.map((item: any) => `
            <div class="item">
              <strong>${item.name}</strong> x${item.quantity} - ${item.price.toFixed(2)} €
            </div>
          `).join('')}
          
          <div class="total">
            Total: ${orderData.total.toFixed(2)} €
          </div>
        </div>
        
        <div class="footer">
          <p>Merci pour votre confiance !</p>
          <p>Flocon - L'Art du Cocooning</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
