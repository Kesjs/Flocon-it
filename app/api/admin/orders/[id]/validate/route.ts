import { NextRequest, NextResponse } from 'next/server';

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

// Fonction pour sauvegarder les commandes
function saveOrders(orders: Map<string, any>): void {
  try {
    const ordersData = Object.fromEntries(orders);
    writeFileSync(ORDERS_FILE, JSON.stringify(ordersData, null, 2));
  } catch (error) {
    console.error('Erreur sauvegarde commandes:', error);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await context.params;
    const { status, validated_by } = await request.json();

    console.log(`🔄 Validation commande ${orderId}: ${status}`);

    // Récupérer les commandes existantes
    const orders = getOrders();
    const order = orders.get(orderId);

    if (!order) {
      console.log('❌ Commande non trouvée:', orderId);
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut
    const updatedOrder = {
      ...order,
      status: status,
      validated_at: new Date().toISOString(),
      validated_by: validated_by
    };

    orders.set(orderId, updatedOrder);
    saveOrders(orders);

    console.log(`✅ Commande ${orderId} mise à jour: ${status}`);

    // TODO: Envoyer un email au client (ici on simule)
    console.log(`📧 Email envoyé au client pour commande ${orderId}`);

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Commande ${orderId} ${status === 'Payé' ? 'validée' : 'rejetée'} avec succès`
    });

  } catch (error) {
    console.error('❌ Erreur validation commande:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la validation de la commande',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
