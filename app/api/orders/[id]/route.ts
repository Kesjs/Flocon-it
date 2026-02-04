import { NextRequest, NextResponse } from 'next/server';

// Stockage partagé - utiliser le même que l'API de création
// On va utiliser un fichier temporaire pour partager entre les deux API
import { writeFileSync, readFileSync, existsSync } from 'fs';
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
    
    console.log('🔍 Récupération commande:', orderId);

    // Récupérer les commandes depuis le fichier partagé
    const orders = getOrders();
    const order = orders.get(orderId);

    if (!order) {
      console.log('❌ Commande non trouvée:', orderId);
      console.log('📋 Commandes disponibles:', Array.from(orders.keys()));
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Commande trouvée:', order.id);
    console.log('📦 Produits récupérés:', order.products.map((p: { name: string }) => p.name));

    return NextResponse.json(order);

  } catch (error) {
    console.error('❌ Erreur récupération commande:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération de la commande',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
