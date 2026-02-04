import { NextRequest, NextResponse } from 'next/server';

// Stockage partagé - utiliser un fichier temporaire pour partager entre les deux API
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ORDERS_FILE = join(process.cwd(), 'temp-orders.json');

// Fonction pour lire les commandes existantes
function getOrders(): Map<string, any> {
  try {
    if (existsSync(ORDERS_FILE)) {
      const data = readFileSync(ORDERS_FILE, 'utf-8');
      const ordersData = JSON.parse(data);
      return new Map(Object.entries(ordersData));
    }
  } catch (error) {
    console.warn('Erreur lecture commandes:', error);
  }
  return new Map();
}

// Fonction pour sauvegarder les commandes
function saveOrders(orders: Map<string, any>): void {
  try {
    const ordersData = Object.fromEntries(orders);
    writeFileSync(ORDERS_FILE, JSON.stringify(ordersData, null, 2));
  } catch (error) {
    console.error('Erreur sauvegarde commandes:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail, shippingAddress, payment_method, total } = await request.json();

    console.log('🏦 Création commande FST:', { items: items?.length, customerEmail, payment_method });

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    // Créer la commande avec les vrais produits du panier
    const orderId = `CMD-${Date.now()}`;
    const order = {
      id: orderId,
      userId: 'guest',
      status: 'En attente',
      total,
      items: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      products: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || ''
      })),
      shippingAddress: {
        name: shippingAddress.name,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        phone: shippingAddress.phone
      },
      date: new Date().toISOString()
    };

    // Récupérer les commandes existantes et ajouter la nouvelle
    const orders = getOrders();
    orders.set(orderId, order);
    
    // Sauvegarder dans le fichier partagé
    saveOrders(orders);

    console.log('✅ Commande FST créée et stockée:', order.id);
    console.log('📦 Produits stockés:', order.products.map((p: { name: string }) => p.name));
    console.log('📋 Total commandes en stock:', orders.size);

    // Retourner la commande créée
    return NextResponse.json({
      id: order.id,
      status: order.status,
      total: order.total,
      items: order.items,
      products: order.products,
      shippingAddress: order.shippingAddress,
      date: order.date
    });

  } catch (error) {
    console.error('❌ Erreur création commande FST:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de la commande',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
