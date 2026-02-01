"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { OrderStorage } from "@/lib/order-storage";

export default function DiagnosticPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [diagnostic, setDiagnostic] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    runDiagnostic();
  }, [user]);

  const runDiagnostic = () => {
    let output = `🔍 DIAGNOSTIC COMPLET\n`;
    output += `====================\n\n`;

    // 1. Vérifier l'utilisateur
    output += `👤 UTILISATEUR:\n`;
    output += `• Connecté: ${user ? '✅ Oui' : '❌ Non'}\n`;
    output += `• ID: ${user?.id || 'N/A'}\n`;
    output += `• Email: ${user?.email || 'N/A'}\n\n`;

    // 2. Analyser localStorage
    output += `💾 LOCALSTORAGE ANALYSE:\n`;
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allKeys.push(key);
      }
    }
    output += `• Total clés: ${allKeys.length}\n`;
    output += `• Clés trouvées: ${allKeys.join(', ')}\n\n`;

    // 3. Vérifier les commandes
    if (user) {
      output += `🛒 COMMANDES:\n`;
      try {
        const userOrders = OrderStorage.getUserOrders(user.id);
        output += `• Nombre de commandes: ${userOrders.length}\n`;
        
        userOrders.forEach((order, index) => {
          output += `  ${index + 1}. ${order.id} - ${order.status} - ${order.total}€\n`;
          output += `     Date: ${order.date}\n`;
          output += `     Produits: ${order.products.length}\n`;
          
          // Vérifier si c'est une commande mockée
          if (order.id.includes('CMD-') && !order.id.includes('cs_test_')) {
            output += `     ⚠️  POSSIBLE COMMANDE MOCKÉE\n`;
          }
          if (order.id.includes('cs_test_')) {
            output += `     💳 COMMANDE STRIPE\n`;
          }
        });
        
        setOrders(userOrders);
      } catch (error) {
        output += `❌ Erreur: ${error}\n`;
      }
    } else {
      output += `❌ Pas d'utilisateur connecté\n`;
    }

    // 4. Vérifier les stats
    output += `\n📊 STATS UTILISATEUR:\n`;
    if (user) {
      try {
        const stats = OrderStorage.getUserStats(user.id);
        output += `• Stats trouvées: ${stats ? '✅ Oui' : '❌ Non'}\n`;
        if (stats) {
          output += `• Total commandes: ${stats.totalOrders}\n`;
          output += `• Total dépensé: ${stats.totalSpent}€\n`;
          output += `• Points fidélité: ${stats.loyaltyPoints}\n`;
        }
      } catch (error) {
        output += `❌ Erreur stats: ${error}\n`;
      }
    }

    // 5. Vérifier les données brutes
    output += `\n🔍 DONNÉES BRUTES:\n`;
    const ordersKey = 'flocon_orders';
    const rawOrders = localStorage.getItem(ordersKey);
    if (rawOrders) {
      try {
        const parsed = JSON.parse(rawOrders);
        output += `• Commandes brutes: ${Array.isArray(parsed) ? parsed.length : 'N/A'}\n`;
        output += `• Type: ${Array.isArray(parsed) ? 'Array' : typeof parsed}\n`;
        
        // Analyser chaque commande
        if (Array.isArray(parsed)) {
          parsed.forEach((order: any, index: number) => {
            output += `  ${index + 1}. ID: ${order.id}, User: ${order.userId}\n`;
          });
        }
      } catch (error) {
        output += `❌ Erreur parsing: ${error}\n`;
      }
    } else {
      output += `• Aucune donnée brute trouvée\n`;
    }

    setDiagnostic(output);
  };

  const forceClean = () => {
    if (confirm('NETTOYAGE COMPLET - Êtes-vous sûr ?')) {
      // Supprimer TOUT ce qui est possible
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
          localStorage.removeItem(key);
        }
      }
      
      alert(`✅ ${keys.length} clés supprimées! Rechargement...`);
      window.location.reload();
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textDark mb-2">
            🔍 Diagnostic Dashboard
          </h1>
          <p className="text-gray-600">
            Analyse complète pour trouver les données mockées
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Diagnostic */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Résultats</h2>
            <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
              {diagnostic}
            </pre>
          </div>

          {/* Commandes détaillées */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🛒 Commandes détaillées</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {orders.map((order, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{order.id}</span>
                      <span className={order.id.includes('cs_test_') ? 'text-purple-600' : 'text-green-600'}>
                        {order.id.includes('cs_test_') ? '💳 Stripe' : '🟢 Test'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {order.status} • {order.total}€ • {order.items} articles
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <button
            onClick={runDiagnostic}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Relancer diagnostic
          </button>
          <button
            onClick={forceClean}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🧹 Nettoyage complet
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => router.push('/clean-data')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            🧹 Nettoyage normal
          </button>
        </div>
      </div>
    </div>
  );
}
