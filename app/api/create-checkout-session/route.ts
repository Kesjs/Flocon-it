import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { corsMiddleware, handleOptions } from '@/lib/cors';
import { validateCheckoutRequest, sanitizeString } from '@/lib/validation';
import { apiRateLimit } from '@/lib/rate-limit';
import { APP_CONFIG } from '@/lib/config';

// Vérifier si Stripe est configuré avant de l'initialiser
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

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
    console.log('Début de la création de session Stripe...');

    const body = await request.json();
    
    // Validation des inputs
    const validation = validateCheckoutRequest(body);
    if (!validation.isValid) {
      const response = NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validation.errors 
        },
        { status: 400 }
      );
      return corsMiddleware(request, response);
    }

    // Nettoyer les données
    const { cartItems, customerEmail, metadata } = {
      cartItems: body.cartItems.map((item: any) => ({
        ...item,
        name: sanitizeString(item.name),
        description: item.description ? sanitizeString(item.description) : undefined
      })),
      customerEmail: sanitizeString(body.customerEmail),
      metadata: body.metadata || {}
    };

    console.log('Données validées:', { cartItems: cartItems.length, customerEmail });

    // Créer les line items pour Stripe
    const lineItems = cartItems.map((item: any, index: number) => {
      console.log(`Traitement de l'article ${index}:`, item.name, 'image:', item.image);
      
      const productData: any = {
        name: item.name,
        description: item.description && item.description.trim() ? item.description : `Produit: ${item.name}`,
      };
      
      // N'ajouter la propriété images que si on a des images valides
      // TEMPORAIRE: Désactivé pour éviter l'erreur Stripe
      /*
      const validImage = APP_CONFIG.validateImageUrl(item.image);
      if (validImage) {
        productData.images = [validImage];
        console.log(`✅ Image ${index} valide:`, validImage);
      } else {
        console.warn(`❌ Image ${index} invalide ou filtrée:`, item.image);
      }
      */

      return {
        price_data: {
          currency: 'eur',
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Convertir en centimes
        },
        quantity: item.quantity,
      };
    });

    console.log('Line items créés:', lineItems.length);

    // Calculer le total
    const total = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    // Obtenir les URLs de redirection depuis la configuration
    const stripeUrls = APP_CONFIG.getStripeUrls();
    console.log('Urls de redirection:', stripeUrls);

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: stripeUrls.success_url,
      cancel_url: stripeUrls.cancel_url,
      customer_email: customerEmail,
      // Ne pas stocker cartItems dans metadata (limite 500 caractères)
      // Utiliser uniquement des métadonnées essentielles avec l'adresse complète
      metadata: {
        order_id: `CMD-${Date.now()}`,
        customer_email: customerEmail,
        items_count: cartItems.length.toString(),
        total_amount: total.toString(),
        // Ajouter l'adresse de livraison dans les métadonnées
        shipping_name: shippingAddress.name || customerEmail,
        shipping_address: shippingAddress.address || '',
        shipping_city: shippingAddress.city || '',
        shipping_postal_code: shippingAddress.postalCode || '',
        shipping_phone: shippingAddress.phone || '',
        shipping_country: shippingAddress.country || 'FR',
        ...metadata,
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

    console.log('Session Stripe créée:', session.id);

    const response = NextResponse.json({ sessionId: session.id, url: session.url });
    return corsMiddleware(request, response);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Gestion détaillée des erreurs
    let errorMessage = 'Erreur lors de la création de la session de paiement';
    let statusCode = 500;
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Erreurs spécifiques à Stripe
      if (error.message.includes('Not a valid URL')) {
        errorMessage = 'URL de redirection invalide - vérifiez la configuration NEXT_PUBLIC_SITE_URL';
        statusCode = 400;
      } else if (error.message.includes('Invalid image URL')) {
        errorMessage = 'URL d\'image invalide dans les produits du panier';
        statusCode = 400;
      } else if (error.message.includes('No such token')) {
        errorMessage = 'Clé API Stripe invalide';
        statusCode = 401;
      } else if (error.message.includes('amount')) {
        errorMessage = 'Montant invalide - vérifiez les prix des produits';
        statusCode = 400;
      }
    }
    
    const response = NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
    
    return corsMiddleware(request, response);
  }
}
