"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordSecure() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      // Message transparent mais sécurisé
      setSuccess(true);
      setMessage(
        email.includes("@") 
          ? `Si un compte existe avec l'adresse ${email}, vous recevrez un email de réinitialisation dans quelques minutes.`
          : "Si un compte existe avec cette adresse, vous recevrez un email de réinitialisation."
      );
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
            Instructions envoyées
          </h1>
          
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              {message}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">Conseils :</p>
                  <ul className="space-y-1 text-blue-600">
                    <li>• Vérifiez votre boîte de réception</li>
                    <li>• Consultez vos dossiers Spam/Promotions</li>
                    <li>• Ajoutez notre email à vos contacts</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                Vous n'avez pas de compte ?
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-rose-custom hover:underline font-medium text-sm"
              >
                Créer un compte gratuitement
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/login"
              className="block w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors"
            >
              Retour à la connexion
            </Link>
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
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
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

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">
            Vous n'avez pas de compte ? {" "}
          </p>
          <Link
            href="/register"
            className="text-rose-custom hover:underline font-medium"
          >
            Créer un compte gratuitement
          </Link>
        </div>

        <div className="mt-4 text-center">
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
