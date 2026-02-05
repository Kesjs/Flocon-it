"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, Shield, BarChart3, Target, Settings2, Check } from "lucide-react";

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

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  // 1. Gestion de l'hydratation et récupération des préférences
  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie-consent');
    const savedPrefs = localStorage.getItem('cookie-preferences');
    
    if (!consent) {
      // Délai subtil pour laisser le LCP (Largest Contentful Paint) se charger
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    } else if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      setPreferences(parsed);
      applyCookiePreferences(parsed);
    }
  }, []);

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    if (typeof window === 'undefined') return;

    // Helper pour set les cookies proprement
    const setCookie = (name: string, val: string) => {
      const date = new Date();
      date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${val};expires=${date.toUTCString()};path=/;SameSite=Lax;Secure`;
    };

    setCookie("flocon_consent", "true");
    setCookie("flocon_analytics", prefs.analytics.toString());
    setCookie("flocon_marketing", prefs.marketing.toString());

    // Google Consent Mode v2 (Standard SaaS/E-com)
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': prefs.analytics ? 'granted' : 'denied',
        'ad_storage': prefs.marketing ? 'granted' : 'denied',
        'personalization_storage': prefs.marketing ? 'granted' : 'denied',
      });
    }
  };

  const handleSave = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent', 'true');
    setPreferences(prefs);
    applyCookiePreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allIn: CookiePreferences = { essential: true, functional: true, analytics: true, marketing: true };
    handleSave(allIn);
  };

  const acceptEssential = () => {
    handleSave(defaultPreferences);
  };

  // Empêcher le flash au rendu serveur
  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && !showSettings && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="fixed bottom-6 left-6 z-[60] max-w-sm w-[calc(100vw-3rem)]"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 p-6 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
              <button 
                onClick={acceptEssential}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-500 p-2.5 rounded-2xl shadow-lg shadow-rose-200">
                    <Cookie className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 tracking-tight">Expérience Flocon</h3>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Confidentialité</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  Nous utilisons des cookies pour optimiser votre shopping et sécuriser vos transactions.
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={acceptAll}
                    className="w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98]"
                  >
                    Tout accepter
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Réglages
                    </button>
                    <button
                      onClick={acceptEssential}
                      className="py-2.5 text-gray-500 text-xs font-medium hover:text-gray-900 transition-all"
                    >
                      Refuser tout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de réglages (Glassmorphism Overlay) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-md z-[70] flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Préférences</h2>
                    <p className="text-sm text-gray-500">Contrôlez vos données personnelles</p>
                  </div>
                  <button onClick={() => setShowSettings(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'essential', label: 'Essentiels', icon: Shield, color: 'text-blue-500', desc: 'Sécurité et paiement.', disabled: true },
                    { id: 'functional', label: 'Confort', icon: Cookie, color: 'text-orange-500', desc: 'Se souvenir de votre panier.' },
                    { id: 'analytics', label: 'Analyses', icon: BarChart3, color: 'text-purple-500', desc: 'Améliorer nos services.' },
                    { id: 'marketing', label: 'Publicité', icon: Target, color: 'text-rose-500', desc: 'Offres personnalisées.' },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => item.id !== 'essential' && setPreferences({...preferences, [item.id]: !preferences[item.id as keyof CookiePreferences]})}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${preferences[item.id as keyof CookiePreferences] ? 'border-gray-900 bg-gray-50' : 'border-gray-100 opacity-60'}`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${preferences[item.id as keyof CookiePreferences] ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                        {preferences[item.id as keyof CookiePreferences] && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSave(preferences)}
                  className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                  Enregistrer mes choix
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger flottant après consentement */}
      {!showBanner && mounted && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-6 left-6 p-3 bg-white border border-gray-200 rounded-full shadow-lg hover:scale-110 transition-all z-50 text-gray-400 hover:text-rose-500"
        >
          <Shield className="w-5 h-5" />
        </button>
      )}
    </>
  );
}