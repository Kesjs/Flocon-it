"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, AlertCircle, CheckCircle, UserPlus, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordFinal() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Vérifier si l'email existe
    try {
      const checkResponse = await fetch('/api/check-email-existence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const { exists } = await checkResponse.json();
      
      if (!exists) {
        setError(`Aucun compte trouvé avec l'adresse "${email}". Voulez-vous créer un compte ?`);
        setLoading(false);
        return;
      }
    } catch (error) {
      // Si la vérification échoue, continuer avec le flux normal
      console.warn('Erreur vérification email:', error);
    }

    // 2. Si l'email existe, envoyer la réinitialisation
    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-iceBlue/20 px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold text-textDark mb-4">
            Email envoyé !
          </h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              Un email de réinitialisation a été envoyé à <span className="font-medium">{email}</span>.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">Conseils importants :</p>
                  <ul className="space-y-1 text-blue-600">
                    <li>• Vérifiez votre boîte de réception principale</li>
                    <li>• Consultez vos dossiers "Spam" et "Promotions"</li>
                    <li>• Ajoutez notre email à vos contacts pour la prochaine fois</li>
                    <li>• Le lien expirera dans 24 heures</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors"
            >
              Retour à la connexion
            </Link>
            
            <button
              onClick={() => {
                setSuccess(false);
                setEmail("");
                setError("");
              }}
              className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
            >
              Envoyer un autre email
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-iceBlue/20 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-textDark mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-700 text-sm font-medium">{error}</p>
                
                {error.includes("Aucun compte trouvé") && (
                  <div className="mt-4 space-y-3">
                    <button
                      onClick={() => router.push('/register?email=' + encodeURIComponent(email))}
                      className="w-full bg-rose-custom text-white py-3 rounded-lg font-medium hover:bg-rose-custom/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Créer un compte avec cet email
                    </button>
                    
                    <div className="text-center">
                      <button
                        onClick={() => {
                          setError("");
                          setEmail("");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Essayer avec une autre adresse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textDark mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-transparent outline-none transition-all"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer le lien
                <Mail className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <div className="text-sm text-gray-600">
            Vous n'avez pas de compte ? {" "}
            <Link
              href="/register"
              className="text-rose-custom hover:underline font-medium"
            >
              Créer un compte gratuitement
            </Link>
          </div>
          
          <Link
            href="/login"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
