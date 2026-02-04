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

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Récupération commandes admin');
    
    // Récupérer toutes les commandes
    const orders = getOrders();
    const ordersArray = Array.from(orders.values());
    
    // Filtrer seulement les commandes FST (Flocon Secure Transfer)
    const fstOrders = ordersArray.filter(order => 
      order.shippingAddress && order.status !== undefined
    );

    console.log(`✅ ${fstOrders.length} commandes FST trouvées`);

    return NextResponse.json(fstOrders);

  } catch (error) {
    console.error('❌ Erreur récupération commandes admin:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des commandes',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
