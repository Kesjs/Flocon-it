"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Shield, BarChart3, Target } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true, // Toujours obligatoire
  functional: false,
  analytics: false,
  marketing: false,
};

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);

  // Vérifier si l'utilisateur a déjà donné son consentement
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    const savedPrefs = localStorage.getItem('cookie-preferences');
    
    if (!consent) {
      // Afficher la bannière après 2 secondes
      const timer = setTimeout(() => {
        console.log('🍪 Affichage bannière cookies');
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setHasConsented(true);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    console.log('🍪 Sauvegarde préférences cookies:', prefs);
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent', 'true');
    setPreferences(prefs);
    setHasConsented(true);
    setShowBanner(false);
    
    // Appliquer les préférences
    applyCookiePreferences(prefs);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Cookies essentiels (toujours activés)
    document.cookie = "flocon_essential=true; max-age=31536000; path=/; secure; samesite=strict";
    
    // Cookies fonctionnels
    if (prefs.functional) {
      document.cookie = "flocon_functional=true; max-age=31536000; path=/; secure; samesite=strict";
    } else {
      document.cookie = "flocon_functional=; max-age=0; path=/";
    }
    
    // Cookies analytiques
    if (prefs.analytics) {
      // Activer Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
      document.cookie = "flocon_analytics=true; max-age=31536000; path=/; secure; samesite=strict";
    } else {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
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

  const acceptAll = () => {
    const allPrefs: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allPrefs);
  };

  const acceptEssential = () => {
    const essentialPrefs: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(essentialPrefs);
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Les essentiels ne peuvent pas être désactivés
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !showSettings && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 p-4"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="w-6 h-6 text-rose-custom flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Flocon utilise des cookies</span> pour améliorer votre expérience, analyser le trafic et personnaliser les publicités.
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="text-rose-custom hover:underline ml-1 font-medium"
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={acceptEssential}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Essentiels seulement
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 bg-rose-custom text-white text-sm font-medium rounded-lg hover:bg-rose-custom/90 transition-colors"
                >
                  Tout accepter
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ⚙️
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-rose-custom" />
                  <h2 className="text-2xl font-bold text-gray-900">Préférences cookies</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <p className="text-gray-600">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
                  Vous pouvez choisir ci-dessous les types de cookies que vous souhaitez autoriser.
                </p>

                {/* Cookie Options */}
                <div className="space-y-4">
                  {/* Essential */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        id="essential"
                        checked={preferences.essential}
                        disabled
                        className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <label htmlFor="essential" className="font-medium text-gray-900">
                          Cookies essentiels
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Nécessaires au fonctionnement du site (authentification, panier, sécurité). 
                        Toujours activés.
                      </p>
                    </div>
                  </div>

                  {/* Functional */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        id="functional"
                        checked={preferences.functional}
                        onChange={() => togglePreference('functional')}
                        className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Cookie className="w-4 h-4 text-blue-600" />
                        <label htmlFor="functional" className="font-medium text-gray-900">
                          Cookies fonctionnels
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Améliorent l'expérience (panier persistant, préférences, personnalisation).
                      </p>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        id="analytics"
                        checked={preferences.analytics}
                        onChange={() => togglePreference('analytics')}
                        className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                        <label htmlFor="analytics" className="font-medium text-gray-900">
                          Cookies analytiques
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Nous aident à comprendre comment vous utilisez le site (Google Analytics).
                      </p>
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        id="marketing"
                        checked={preferences.marketing}
                        onChange={() => togglePreference('marketing')}
                        className="w-4 h-4 text-rose-custom rounded focus:ring-rose-custom"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-orange-600" />
                        <label htmlFor="marketing" className="font-medium text-gray-900">
                          Cookies marketing
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Utilisés pour les publicités personnalisées et le retargeting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Pour en savoir plus, consultez notre{' '}
                    <a href="/politique-confidentialite" className="text-rose-custom hover:underline">
                      politique de confidentialité
                    </a>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2 bg-rose-custom text-white font-medium rounded-lg hover:bg-rose-custom/90 transition-colors"
                >
                  Enregistrer mes préférences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton de gestion des cookies (visible après consentement) */}
      {hasConsented && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40"
          title="Gérer les cookies"
        >
          <Cookie className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
