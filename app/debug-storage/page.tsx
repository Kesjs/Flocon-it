"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DebugStoragePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [storageData, setStorageData] = useState<{key: string, value: string, size: number}[]>([]);
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    analyzeStorage();
  }, []);

  const analyzeStorage = () => {
    const data: {key: string, value: string, size: number}[] = [];
    let totalSize = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([key + value]).size;
        totalSize += size;
        
        data.push({
          key,
          value: value.length > 100 ? value.substring(0, 100) + '...' : value,
          size
        });
      }
    }
    
    setStorageData(data);
    
    // Analyse
    let analysisText = `📊 Analyse localStorage:\n`;
    analysisText += `• Total entrées: ${data.length}\n`;
    analysisText += `• Taille totale: ${(totalSize / 1024).toFixed(2)} KB\n\n`;
    
    // Catégoriser les données
    const categories = {
      flocon: data.filter(item => item.key.includes('flocon')),
      cart: data.filter(item => item.key.includes('cart')),
      order: data.filter(item => item.key.includes('order')),
      other: data.filter(item => !item.key.includes('flocon') && !item.key.includes('cart') && !item.key.includes('order'))
    };
    
    analysisText += `📂 Catégories:\n`;
    analysisText += `• Flocon: ${categories.flocon.length} entrées\n`;
    analysisText += `• Cart: ${categories.cart.length} entrées\n`;
    analysisText += `• Order: ${categories.order.length} entrées\n`;
    analysisText += `• Other: ${categories.other.length} entrées\n\n`;
    
    // Détails des commandes
    const orderData = data.filter(item => item.key.includes('order') || item.key.includes('flocon_orders'));
    if (orderData.length > 0) {
      analysisText += `🛒 Données de commandes trouvées:\n`;
      orderData.forEach(item => {
        try {
          const parsed = JSON.parse(localStorage.getItem(item.key) || '[]');
          analysisText += `• ${item.key}: ${Array.isArray(parsed) ? parsed.length : 'N/A'} commandes\n`;
        } catch {
          analysisText += `• ${item.key}: Non-parsable\n`;
        }
      });
    }
    
    setAnalysis(analysisText);
  };

  const clearSpecific = (key: string) => {
    if (confirm(`Supprimer "${key}" ?`)) {
      localStorage.removeItem(key);
      analyzeStorage();
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-cream px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textDark mb-2">
            🔍 Debug localStorage
          </h1>
          <p className="text-gray-600">
            Analyse complète des données stockées dans votre navigateur
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analyse */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Analyse</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-auto">
              {analysis}
            </pre>
          </div>

          {/* Données détaillées */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Données détaillées</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {storageData.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-medium text-blue-600">
                        {item.key}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.value}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-500">
                        {(item.size / 1024).toFixed(2)} KB
                      </span>
                      <button
                        onClick={() => clearSpecific(item.key)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={analyzeStorage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Actualiser
          </button>
          <button
            onClick={() => router.push('/clean-data')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🧹 Nettoyer tout
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🏠 Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
