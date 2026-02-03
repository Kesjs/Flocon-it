import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('💳 Paiement reçu:', session.id);
    
    try {
      // Récupérer les informations depuis la session Stripe
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name || 'Client';
      
      if (!customerEmail) {
        console.error('❌ Email client manquant');
        return new NextResponse('Email client manquant', { status: 400 });
      }

      // Récupérer les items depuis les métadonnées ou créer un item par défaut
      let cartItems = [];
      try {
        if (session.metadata?.cartItems) {
          cartItems = JSON.parse(session.metadata.cartItems);
        } else {
          // Créer un item par défaut depuis les métadonnées disponibles
          cartItems = [{
            id: session.metadata?.order_id || 'unknown',
            name: 'Commande Flocon',
            price: parseFloat(session.metadata?.total_amount || session.amount_total?.toString() || '0') / 100,
            quantity: parseInt(session.metadata?.items_count || '1')
          }];
        }
      } catch (error) {
        console.error('❌ Erreur parsing cartItems:', error);
        cartItems = [{
          id: 'default',
          name: 'Commande Flocon',
          price: (session.amount_total || 0) / 100,
          quantity: 1
        }];
      }
      
      // Calculer le total
      const total = (session.amount_total || 0) / 100;

      // Envoyer l'email de reçu
      await sendReceiptEmail({
        email: customerEmail,
        orderId: session.id,
        customerName: customerName,
        items: cartItems,
        total: total,
        shippingAddress: {
          name: session.metadata?.shipping_name || customerName,
          address: session.metadata?.shipping_address || session.customer_details?.address?.line1 || 'Adresse non spécifiée',
          city: session.metadata?.shipping_city || session.customer_details?.address?.city || 'Ville non spécifiée',
          postalCode: session.metadata?.shipping_postal_code || session.customer_details?.address?.postal_code || 'Code postal non spécifié',
          phone: session.metadata?.shipping_phone || session.customer_details?.phone || 'Téléphone non spécifié',
          country: session.metadata?.shipping_country || session.customer_details?.address?.country || 'FR'
        },
        paymentDate: new Date(session.created * 1000).toLocaleDateString('fr-FR'),
        paymentMethod: 'Carte bancaire (Stripe)'
      });

      console.log('✅ Email de reçu envoyé à:', customerEmail);
      
    } catch (error) {
      console.error('❌ Erreur envoi email reçu:', error);
      return new NextResponse('Erreur envoi email', { status: 500 });
    }
  }

  return new NextResponse('OK', { status: 200 });
}

interface ReceiptData {
  email: string;
  orderId: string;
  customerName: string;
  items: any[];
  total: number;
  shippingAddress: any;
  paymentDate: string;
  paymentMethod: string;
}

async function sendReceiptEmail(data: ReceiptData) {
  if (!resend) {
    console.log('⚠️ Resend non configuré, email non envoyé');
    return;
  }

  const emailHtml = generateReceiptHTML(data);

  try {
    await resend.emails.send({
      from: 'Flocon <noreply@flocon-boutique.com>',
      to: [data.email],
      subject: `🧾 Reçu de commande #${data.orderId.slice(-8)}`,
      html: emailHtml,
    });
    console.log('✅ Email de reçu envoyé à:', data.email);
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
  }
}

function generateReceiptHTML(data: ReceiptData): string {
  const itemsHTML = data.items.map((item: any) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; text-align: left;">${item.name}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">${item.price.toFixed(2)} €</td>
      <td style="padding: 12px; text-align: right; font-weight: bold;">
        ${(item.price * item.quantity).toFixed(2)} €
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reçu de commande - Flocon</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #e11d48; }
        .title { color: #e11d48; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .address-box { background: #f8f8f8; padding: 15px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f8f8f8; padding: 12px; text-align: left; font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; color: #e11d48; }
        .footer { border-top: 2px solid #e11d48; padding-top: 20px; margin-top: 30px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🧊 Flocon</div>
          <h1 class="title">Reçu de commande</h1>
          <p><strong>Commande #</strong>${data.orderId.slice(-8)}</p>
          <p><strong>Date:</strong> ${data.paymentDate}</p>
        </div>

        <div class="section">
          <h2>Informations client</h2>
          <p><strong>Nom:</strong> ${data.customerName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
        </div>

        <div class="section">
          <h2>Adresse de livraison</h2>
          <div class="address-box">
            <p><strong>${data.shippingAddress.name}</strong></p>
            <p>${data.shippingAddress.address}</p>
            <p>${data.shippingAddress.postalCode} ${data.shippingAddress.city}</p>
            <p>${data.shippingAddress.phone}</p>
          </div>
        </div>

        <div class="section">
          <h2>Détails de la commande</h2>
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                <td class="total">${data.total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="section">
          <h2>Paiement</h2>
          <p><strong>Méthode:</strong> ${data.paymentMethod}</p>
          <p><strong>Statut:</strong> <span style="color: green;">✅ Payé</span></p>
        </div>

        <div class="footer">
          <p>Merci pour votre commande chez Flocon !</p>
          <p>Pour toute question, contactez-nous à contact@flocon-boutique.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
