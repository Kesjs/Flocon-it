"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";

export default function FloconAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simuler un délai pour montrer le chargement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Vérification admin simple
      if (email === "admin@flocon.market" && password === "Admin2026!") {
        // Stocker le token admin dans localStorage
        localStorage.setItem('flocon_admin_token', 'flocon_admin_secure_2026');
        localStorage.setItem('flocon_admin_email', email);
        
        // Feedback succès avant redirection
        setLoading(false);
        
        // Rediriger vers le dashboard admin
        router.push('/Flocon/admin/dashboard');
      } else {
        setError("Identifiants incorrects");
        setLoading(false);
      }
    } catch (error) {
      setError("Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <g fill="#9C92AC" fillOpacity="0.1">
              <circle cx="30" cy="30" r="2"/>
            </g>
          </g>
        </svg>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Flocon Admin
          </h1>
          <p className="text-gray-400 text-lg">
            Panneau d'administration sécurisé
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-red-900/30 border border-red-700 rounded-full">
            <span className="text-red-400 text-sm font-medium">Accès restreint</span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
                Email administrateur
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 backdrop-blur-sm ${
                  loading 
                    ? 'bg-slate-700/30 border-slate-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:bg-slate-700/70'
                } border`}
                placeholder="admin@flocon.market"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                  loading ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl outline-none transition-all duration-200 backdrop-blur-sm ${
                    loading 
                      ? 'bg-slate-700/30 border-slate-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:bg-slate-700/70'
                  } border`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    loading 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-gray-300 cursor-pointer'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed opacity-60' 
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              } text-white`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Accéder à l'administration</span>
                </>
              )}
            </button>
          </form>

          {/* Footer sécurité */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">
                Accès réservé au personnel autorisé de Flocon Market
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Connexion sécurisée</span>
                </div>
                <span>•</span>
                <span>Admin v3.0</span>
                <span>•</span>
                <span>SEPA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
