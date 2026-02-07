"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CleanDataPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCleaning, setIsCleaning] = useState(false);
  const [message, setMessage] = useState('');

  const cleanAllData = () => {
    setIsCleaning(true);
    setMessage('Nettoyage en cours...');

    try {
      // D'abord, lister toutes les clés existantes pour débogage
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          allKeys.push(key);
        }
      }

      // Nettoyer TOUTES les données possibles
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('flocon') || 
          key.includes('cart') || 
          key.includes('checkout') || 
          key.includes('order') ||
          key.includes('demo') ||
          key.includes('test')
        )) {
          keysToRemove.push(key);
        }
      }

      // Supprimer toutes les clés trouvées
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Nettoyage forcé des clés connues
      const forcedKeys = [
        'flocon_orders',
        'flocon_user_stats',
        'flocon_cart',
        'flocon_checkout',
        'cart',
        'orders',
        'user_stats'
      ];

      forcedKeys.forEach(key => {
        localStorage.removeItem(key);
        // Nettoyer aussi les variantes avec userId
        if (user?.id) {
          localStorage.removeItem(`${key}_${user.id}`);
          localStorage.removeItem(`${key}_${user.id}_stats`);
        }
      });

      // Nettoyer les stats par utilisateur
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('flocon_user_stats_')) {
          localStorage.removeItem(key);
        }
      }

      // Vérification finale
      const remainingKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          remainingKeys.push(key);
        }
      }

      setMessage(`✅ Nettoyage terminé ! ${keysToRemove.length + forcedKeys.length} entrées supprimées.`);
      
      // Forcer le rechargement de la page
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setMessage(`❌ Erreur lors du nettoyage: ${error}`);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-textDark mb-4">
          Nettoyer les données
        </h1>
        
        <p className="text-gray-600 mb-6">
          Cette page va supprimer toutes les données de test et les commandes mockées de votre localStorage.
        </p>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={cleanAllData}
          disabled={isCleaning}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCleaning ? 'Nettoyage...' : 'Supprimer toutes les données'}
        </button>

        <div className="mt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
