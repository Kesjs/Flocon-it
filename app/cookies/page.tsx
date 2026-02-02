"use client";

import { motion } from "framer-motion";
import { Cookie, Shield, BarChart3, Target, ArrowLeft, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export default function CookiesPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookie-preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    setSaved(true);
    
    // Appliquer les préférences
    applyCookiePreferences(preferences);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Cookies essentiels
    document.cookie = "flocon_essential=true; max-age=31536000; path=/; secure; samesite=strict";
    
    // Cookies fonctionnels
    if (prefs.functional) {
      document.cookie = "flocon_functional=true; max-age=31536000; path=/; secure; samesite=strict";
    } else {
      document.cookie = "flocon_functional=; max-age=0; path=/";
    }
    
    // Cookies analytiques
    if (prefs.analytics) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
      document.cookie = "flocon_analytics=true; max-age=31536000; path=/; secure; samesite=strict";
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
      document.cookie = "flocon_analytics=; max-age=0; path=/";
    }
    
    // Cookies marketing
    if (prefs.marketing) {
      document.cookie = "flocon_marketing=true; max-age=31536000; path=/; secure; samesite=strict";
    } else {
      document.cookie = "flocon_marketing=; max-age=0; path=/";
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return;
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const acceptAll = () => {
    const allPrefs: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allPrefs);
    savePreferences();
  };

  const acceptEssential = () => {
    const essentialPrefs: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialPrefs);
    savePreferences();
  };

  return (
    <div className="pt-28 min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-rose-custom/10 rounded-full flex items-center justify-center">
              <Cookie className="w-8 h-8 text-rose-custom" />
            </div>
            <h1 className="text-4xl font-display font-bold text-gray-900">
              Politique des Cookies
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 max-w-3xl">
            Chez Flocon, nous nous engageons à être transparents sur l'utilisation des cookies 
            et à vous donner le contrôle sur vos données personnelles.
          </p>
        </motion.div>

        {/* Message de succès */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-medium">
              Vos préférences ont été enregistrées avec succès !
            </p>
          </motion.div>
        )}

        {/* Qu'est-ce qu'un cookie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Qu'est-ce qu'un cookie ?</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez un site web. 
              Il permet au site de mémoriser vos actions et préférences pour une durée déterminée.
            </p>
            <p className="text-gray-600">
              Les cookies nous aident à améliorer votre expérience de navigation, à sécuriser votre connexion 
              et à comprendre comment vous utilisez notre site.
            </p>
          </div>
        </motion.div>

        {/* Types de cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Types de cookies que nous utilisons</h2>
          
          <div className="space-y-6">
            {/* Essential */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies essentiels</h3>
                <p className="text-gray-600 mb-3">
                  Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Maintien de votre session de connexion</li>
                  <li>• Gestion de votre panier d'achat</li>
                  <li>• Protection contre les attaques CSRF</li>
                  <li>• Mémorisation de vos préférences de base</li>
                </ul>
              </div>
            </div>

            {/* Functional */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies fonctionnels</h3>
                <p className="text-gray-600 mb-3">
                  Ces cookies améliorent votre expérience en mémorisant vos préférences.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Sauvegarde de votre panier entre les visites</li>
                  <li>• Mémorisation de vos filtres et tri</li>
                  <li>• Personnalisation de l'interface</li>
                  <li>• Rappel de vos informations de connexion</li>
                </ul>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies analytiques</h3>
                <p className="text-gray-600 mb-3">
                  Ces cookies nous aident à comprendre comment vous utilisez notre site.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Nombre de visiteurs et pages vues</li>
                  <li>• Temps passé sur le site</li>
                  <li>• Taux de rebond</li>
                  <li>• Navigation et chemins utilisateurs</li>
                </ul>
              </div>
            </div>

            {/* Marketing */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies marketing</h3>
                <p className="text-gray-600 mb-3">
                  Ces cookies sont utilisés pour vous proposer des publicités pertinentes.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Publicités personnalisées</li>
                  <li>• Retargeting sur d'autres sites</li>
                  <li>• Mesure des campagnes publicitaires</li>
                  <li>• Partenaires publicitaires</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gestion des préférences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gérer vos préférences</h2>
          
          <div className="space-y-4 mb-6">
            {/* Essential */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="essential-page"
                  checked={preferences.essential}
                  disabled
                  className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                />
                <div>
                  <label htmlFor="essential-page" className="font-medium text-gray-900">
                    Cookies essentiels
                  </label>
                  <p className="text-sm text-gray-500">Toujours activés (obligatoires)</p>
                </div>
              </div>
              <Shield className="w-5 h-5 text-green-600" />
            </div>

            {/* Functional */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="functional-page"
                  checked={preferences.functional}
                  onChange={() => togglePreference('functional')}
                  className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                />
                <div>
                  <label htmlFor="functional-page" className="font-medium text-gray-900">
                    Cookies fonctionnels
                  </label>
                  <p className="text-sm text-gray-500">Améliorent l'expérience utilisateur</p>
                </div>
              </div>
              <Cookie className="w-5 h-5 text-blue-600" />
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="analytics-page"
                  checked={preferences.analytics}
                  onChange={() => togglePreference('analytics')}
                  className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                />
                <div>
                  <label htmlFor="analytics-page" className="font-medium text-gray-900">
                    Cookies analytiques
                  </label>
                  <p className="text-sm text-gray-500">Statistiques d'utilisation</p>
                </div>
              </div>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="marketing-page"
                  checked={preferences.marketing}
                  onChange={() => togglePreference('marketing')}
                  className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                />
                <div>
                  <label htmlFor="marketing-page" className="font-medium text-gray-900">
                    Cookies marketing
                  </label>
                  <p className="text-sm text-gray-500">Publicités personnalisées</p>
                </div>
              </div>
              <Target className="w-5 h-5 text-orange-600" />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={acceptEssential}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Essentiels seulement
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 px-6 py-3 bg-rose-custom text-white font-medium rounded-lg hover:bg-rose-custom/90 transition-colors"
            >
              Tout accepter
            </button>
            <button
              onClick={savePreferences}
              className="flex-1 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Enregistrer mes choix
            </button>
          </div>
        </motion.div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vos droits</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Conformément au RGPD, vous disposez des droits suivants concernant vos données :
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>Droit d'accès :</strong> Savoir quels cookies sont utilisés</li>
              <li><strong>Droit de rectification :</strong> Modifier vos préférences à tout moment</li>
              <li><strong>Droit d'opposition :</strong> Refuser certains types de cookies</li>
              <li><strong>Droit de suppression :</strong> Supprimer les cookies de votre navigateur</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Vous pouvez gérer vos cookies directement depuis votre navigateur ou via notre panneau de préférences.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Pour toute question sur notre politique de cookies, contactez-nous à{' '}
              <a href="mailto:contact@flocon-market.fr" className="text-rose-custom hover:underline">
                contact@flocon-market.fr
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
