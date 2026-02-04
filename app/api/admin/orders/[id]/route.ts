import { NextRequest, NextResponse } from 'next/server';

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ORDERS_FILE = join(process.cwd(), 'temp-orders.json');

// Fonction pour lire les commandes
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await context.params;

    console.log('🔍 Récupération commande admin:', orderId);

    // Récupérer les commandes depuis le fichier partagé
    const orders = getOrders();
    const order = orders.get(orderId);

    if (!order) {
      console.log('❌ Commande non trouvée:', orderId);
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Commande admin trouvée:', order.id);

    return NextResponse.json(order);

  } catch (error) {
    console.error('❌ Erreur récupération commande admin:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération de la commande',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
