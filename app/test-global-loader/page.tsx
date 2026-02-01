'use client';

import { useState } from 'react';
import { useSimpleLoading } from '@/components/SimpleLoadingProvider';

export default function TestGlobalLoader() {
  const { showLoading, hideLoading } = useSimpleLoading();
  const [testCount, setTestCount] = useState(0);

  const runTest = async (duration: number, message: string) => {
    showLoading(message);
    await new Promise(resolve => setTimeout(resolve, duration));
    hideLoading();
    setTestCount(prev => prev + 1);
  };

  const tests = [
    { duration: 1000, message: 'Chargement rapide...' },
    { duration: 2000, message: 'Traitement des données...' },
    { duration: 3000, message: 'Connexion au serveur...' },
    { duration: 1500, message: 'Redirection vers le paiement...' },
    { duration: 800, message: 'Mise à jour du panier...' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Test du Loader Global</h1>
      
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">Tests disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test, index) => (
            <button
              key={index}
              onClick={() => runTest(test.duration, test.message)}
              className="px-4 py-3 bg-rose-custom text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {test.message} ({test.duration}ms)
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">Test personnalisé</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message:</label>
            <input
              type="text"
              placeholder="Entrez un message..."
              className="w-full px-4 py-2 border rounded-lg"
              id="customMessage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Durée (ms):</label>
            <input
              type="number"
              placeholder="1000"
              className="w-full px-4 py-2 border rounded-lg"
              id="customDuration"
            />
          </div>
          <button
            onClick={() => {
              const message = (document.getElementById('customMessage') as HTMLInputElement)?.value || 'Chargement...';
              const duration = parseInt((document.getElementById('customDuration') as HTMLInputElement)?.value || '1000');
              runTest(duration, message);
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Lancer le test personnalisé
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Tests effectués</p>
            <p className="text-2xl font-bold text-rose-custom">{testCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">État actuel</p>
            <p className="text-2xl font-bold text-green-500">Prêt</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type de loader</p>
            <p className="text-2xl font-bold text-blue-500">Global</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2">💡 Usage dans l'application:</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Panier: "Redirection vers le paiement..."</li>
          <li>• Checkout: "Traitement du paiement..."</li>
          <li>• Recherche: "Chargement des résultats..."</li>
          <li>• Navigation: "Chargement de la page..."</li>
        </ul>
      </div>
    </div>
  );
}
