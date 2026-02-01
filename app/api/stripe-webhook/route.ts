import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { OrderStorage, Order } from '@/lib/order-storage';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: any;

  try {
    // Note: En production, vous devriez vérifier la signature avec votre webhook secret
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // Pour le développement, on parse directement
    event = JSON.parse(body);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      try {
        // Créer la commande depuis la session Stripe
        const userId = session.metadata?.userId || 'anonymous';
        const customerEmail = session.customer_details?.email || session.customer_email;
        
        // Récupérer les items depuis la session
        const lineItems = session.line_items?.data || [];
        const orderProducts = lineItems.map((item: any) => ({
          id: item.price?.id || 'unknown',
          name: item.description || 'Produit',
          price: item.amount_total / 100,
          quantity: item.quantity || 1,
          image: '/logof.jpg' // Image par défaut
        }));

        const total = session.amount_total / 100;
        const items = lineItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

        // Créer l'adresse de livraison depuis les métadonnées Stripe
        const shippingAddress = {
          name: session.metadata?.shipping_name || customerEmail || 'Client',
          address: session.metadata?.shipping_address || 'Adresse non renseignée',
          city: session.metadata?.shipping_city || 'Ville non renseignée',
          postalCode: session.metadata?.shipping_postal_code || '00000',
          phone: session.metadata?.shipping_phone || 'Non renseigné'
        };

        console.log('📦 Adresse de livraison:', shippingAddress);

        // Vérifier si une commande existe déjà pour cette session
        const existingOrders = OrderStorage.getUserOrders(userId);
        const existingOrder = existingOrders.find(order => 
          order.id.includes(session.id) || 
          (order.total === total && 
           order.items === items &&
           Math.abs(new Date(order.date).getTime() - Date.now()) < 300000) // Commande dans les 5 dernières minutes
        );
        
        if (existingOrder) {
          console.log('✅ Commande existe déjà, mise à jour du statut et adresse:', existingOrder.id);
          // Mettre à jour l'adresse de livraison avec les vraies données du webhook
          const allOrders = JSON.parse(localStorage.getItem('flocon_orders') || '[]');
          const globalIndex = allOrders.findIndex((o: any) => o.id === existingOrder.id);
          if (globalIndex !== -1) {
            allOrders[globalIndex].status = 'Livré';
            allOrders[globalIndex].shippingAddress = shippingAddress;
            localStorage.setItem('flocon_orders', JSON.stringify(allOrders));
          }
          return NextResponse.json({ received: true, orderId: existingOrder.id });
        }

        // Ajouter la commande via OrderStorage
        const order = OrderStorage.addOrder({
          userId,
          status: 'Livré', // Stripe signifie que le paiement est réussi
          total,
          items,
          products: orderProducts,
          shippingAddress
        });

        console.log('✅ Commande Stripe créée:', order.id);
        
        return NextResponse.json({ received: true, orderId: order.id });
      } catch (error) {
        console.error('❌ Erreur lors de la création de la commande:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }

    default:
      console.log(`🔔 Unhandled event type: ${event.type}`);
      return NextResponse.json({ received: true });
  }
}
