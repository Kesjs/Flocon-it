"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle, Clock, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PendingConfirmation() {
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'email depuis le localStorage ou les paramètres d'URL
    const storedEmail = localStorage.getItem('pending_confirmation_email');
    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get('email');
    
    if (urlEmail) {
      setEmail(urlEmail);
      localStorage.setItem('pending_confirmation_email', urlEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      if (!supabase) {
        console.error('Supabase client not available');
        return;
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        console.error('Erreur resend:', error);
      } else {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Erreur resend:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-iceBlue/20 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-custom/10 flex items-center justify-center"
          >
            <Mail className="w-10 h-10 text-rose-custom" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold text-textDark mb-4">
            Vérifiez votre email
          </h1>
          
          <p className="text-gray-600 mb-2">
            Un email de confirmation a été envoyé à :
          </p>
          
          <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
            <p className="font-medium text-rose-custom">
              {email || "votre@email.com"}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Ouvrez votre boîte de réception</p>
              <p className="text-xs text-gray-500">Consultez votre email principal</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Cliquez sur le lien de confirmation</p>
              <p className="text-xs text-gray-500">Le lien est valable 24 heures</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <RefreshCw className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Revenez sur cette page</p>
              <p className="text-xs text-gray-500">Vous serez redirigé automatiquement</p>
            </div>
          </div>
        </div>

        {resendSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-green-700 text-sm text-center">
              Email renvoyé avec succès !
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={resendLoading || !email}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Renvoyer l'email
              </>
            )}
          </button>

          <Link
            href="/login"
            className="w-full bg-rose-custom text-white py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Retour à la connexion
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Pas reçu d'email ? Vérifiez vos spams
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>• Boîte de réception</span>
              <span>• Spams</span>
              <span>• Promotions</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-rose-custom hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
