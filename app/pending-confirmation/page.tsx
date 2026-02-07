"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PendingConfirmation() {
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
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
      const supabase = createClient();
      
      // @ts-ignore - Supabase client peut être null en développement
      if (!supabase) {
        alert('Service temporairement indisponible. Réessayez dans quelques instants.');
        setResendLoading(false);
        return;
      }
      
      // On utilise la méthode standard de renvoi
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (!error) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 8000);
      } else {
        alert("Une petite erreur est survenue. Merci de réessayer dans un instant.");
      }
    } catch (err) {
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[480px] w-full"
      >
        {/* En-tête minimaliste */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-custom/5 mb-6">
            <Mail className="w-5 h-5 text-rose-custom stroke-[1.5px]" />
          </div>
          <h1 className="text-3xl font-serif italic text-gray-900 mb-4">
            Une dernière étape...
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Nous avons envoyé un lien de validation à l'adresse <br />
            <span className="font-medium text-gray-900 border-b border-rose-custom/30">
              {email || "votre@email.com"}
            </span>
          </p>
        </div>

        {/* Corps du message - Plus humain, moins technique */}
        <div className="bg-white border border-stone-100 p-8 rounded-2xl shadow-sm mb-8 text-center">
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Pour confirmer votre identité et sécuriser votre compte, merci de cliquer sur le lien contenu dans l'email. Si vous ne le voyez pas, jetez un œil à vos courriers indésirables.
          </p>

          <div className="space-y-4">
            {/* Bouton Principal - Retour à la connexion */}
            <Link
              href="/login"
              className="w-full bg-rose-custom text-white py-4 rounded-xl font-medium hover:bg-rose-custom/90 transition-all shadow-md shadow-rose-custom/10 flex items-center justify-center gap-2"
            >
              Retour à la connexion
            </Link>

            {/* Action de renvoi plus discrète */}
            <button
              onClick={handleResendEmail}
              disabled={resendLoading}
              className="w-full py-3 text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {resendLoading ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {resendSuccess ? "Email renvoyé !" : "Je n'ai rien reçu, renvoyer le lien"}
            </button>
          </div>
        </div>

        {/* Footer de page */}
        <div className="text-center space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la page de connexion
          </Link>

          <div className="pt-6 border-t border-stone-100">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Besoin d'aide ?</p>
            <a 
              href="mailto:contact@flocon-market.fr" 
              className="text-sm text-gray-600 hover:text-rose-custom transition-colors italic"
            >
              contact@flocon-market.fr
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}