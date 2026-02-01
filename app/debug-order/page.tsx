"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { OrderStorage } from "@/lib/order-storage";

export default function DebugOrderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    runDebug();
  }, [user]);

  const runDebug = () => {
    let output = `🔍 DEBUG COMMANDE MANQUANTE\n`;
    output += `===========================\n\n`;

    // 1. Vérifier l'utilisateur
    output += `👤 UTILISATEUR:\n`;
    output += `• Connecté: ${user ? '✅ Oui' : '❌ Non'}\n`;
    output += `• ID: ${user?.id || 'N/A'}\n`;
    output += `• Email: ${user?.email || 'N/A'}\n\n`;

    // 2. Vérifier localStorage
    output += `💾 LOCALSTORAGE:\n`;
    const ordersKey = 'flocon_orders';
    const rawOrders = localStorage.getItem(ordersKey);
    
    if (rawOrders) {
      try {
        const parsed = JSON.parse(rawOrders);
        output += `• Commandes brutes: ${Array.isArray(parsed) ? parsed.length : 'N/A'}\n`;
        
        if (Array.isArray(parsed)) {
          parsed.forEach((order: any, index: number) => {
            output += `  ${index + 1}. ID: ${order.id}, User: ${order.userId}, Status: ${order.status}\n`;
          });
        }
      } catch (error) {
        output += `❌ Erreur parsing: ${error}\n`;
      }
    } else {
      output += `• Aucune donnée trouvée\n`;
    }

    // 3. Vérifier OrderStorage
    output += `\n📦 ORDERSTORAGE:\n`;
    if (user) {
      try {
        const orders = OrderStorage.getUserOrders(user.id);
        output += `• Commandes utilisateur: ${orders.length}\n`;
        
        orders.forEach((order, index) => {
          output += `  ${index + 1}. ${order.id} - ${order.status} - ${order.total}€\n`;
        });
        
        setUserOrders(orders);
      } catch (error) {
        output += `❌ Erreur OrderStorage: ${error}\n`;
      }
    }

    // 4. Vérifier si les commandes existent mais avec mauvais user ID
    output += `\n🔍 VÉRIFICATION USER ID:\n`;
    if (rawOrders) {
      try {
        const allParsed = JSON.parse(rawOrders);
        const otherUserOrders = allParsed.filter((order: any) => order.userId !== user?.id);
        output += `• Commandes autres users: ${otherUserOrders.length}\n`;
        
        if (otherUserOrders.length > 0) {
          output += `• User ID actuel: ${user?.id}\n`;
          output += `• User IDs trouvés: ${[...new Set(allParsed.map((o: any) => o.userId))].join(', ')}\n`;
        }
        
        setAllOrders(allParsed);
      } catch (error) {
        output += `❌ Erreur vérification: ${error}\n`;
      }
    }

    // 5. Vérifier le panier actuel
    output += `\n🛒 PANIER ACTUEL:\n`;
    const cartKey = 'flocon-cart';
    const cartData = localStorage.getItem(cartKey);
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        output += `• Articles dans panier: ${cart.items ? cart.items.length : 0}\n`;
        if (cart.items) {
          cart.items.forEach((item: any, index: number) => {
            output += `  ${index + 1}. ${item.name} - ${item.price}€ x${item.quantity}\n`;
          });
        }
      } catch (error) {
        output += `❌ Erreur panier: ${error}\n`;
      }
    } else {
      output += `• Panier vide\n`;
    }

    setDebugInfo(output);
  };

  const createTestOrder = () => {
    if (!user) {
      alert('Utilisateur non connecté');
      return;
    }

    try {
      const testOrder = OrderStorage.addOrder({
        userId: user.id,
        status: 'Livré',
        total: 99.99,
        items: 1,
        products: [{
          id: 'test-1',
          name: 'Produit Test',
          price: 99.99,
          quantity: 1,
          image: '/logof.jpg'
        }],
        shippingAddress: {
          name: 'Test User',
          address: '123 Test Street',
          city: 'Paris',
          postalCode: '75001',
          phone: '+33 6 00 00 00 00'
        }
      });

      alert(`✅ Commande test créée: ${testOrder.id}`);
      runDebug();
    } catch (error) {
      alert(`❌ Erreur: ${error}`);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textDark mb-2">
            🔍 Debug Commande Manquante
          </h1>
          <p className="text-gray-600">
            Diagnostic complet pour trouver pourquoi votre commande n'apparaît pas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Résultats du diagnostic</h2>
          <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
            {debugInfo}
          </pre>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">📦 Toutes les commandes</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allOrders.map((order, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{order.id}</span>
                      <span className={order.userId === user?.id ? 'text-green-600' : 'text-red-600'}>
                        {order.userId === user?.id ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      User: {order.userId.slice(0, 8)}... • {order.status} • {order.total}€
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">👤 Vos commandes</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userOrders.map((order, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{order.id}</span>
                      <span className="text-green-600">✅</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {order.status} • {order.total}€ • {order.items} articles
                    </div>
                  </div>
                </div>
              ))}
              {userOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">Aucune commande trouvée</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <button
            onClick={runDebug}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Relancer diagnostic
          </button>
          <button
            onClick={createTestOrder}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🧪 Créer commande test
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => router.push('/clean-data')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🧹 Nettoyer tout
          </button>
        </div>
      </div>
    </div>
  );
}
