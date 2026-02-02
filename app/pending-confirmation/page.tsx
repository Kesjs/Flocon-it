"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle, Clock, ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    if (!email) {
      console.error('❌ Aucun email disponible pour renvoyer la confirmation');
      return;
    }
    
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      const supabase = createClient();
      
      if (!supabase) {
        console.error('❌ Supabase client not available');
        return;
      }
      
      console.log('📧 Tentative de renvoi d\'email pour:', email);
      
      // Essayer de renvoyer avec différentes méthodes
      let resendSuccess = false;
      let lastError = null;
      
      // Méthode 1: Resend standard (rate limit de 1 par minute)
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        
        if (error) {
          console.error('❌ Erreur resend standard:', error.message);
          lastError = error;
          
          // Si rate limit, attendre un peu et essayer une autre méthode
          if (error.message.includes('rate limit')) {
            console.log('⏱️ Rate limit détecté, essai méthode alternative...');
          }
        } else {
          console.log('✅ Email renvoyé avec succès (méthode standard)');
          resendSuccess = true;
        }
      } catch (err) {
        console.error('❌ Exception resend standard:', err);
        lastError = err;
      }
      
      // Méthode 2: Si la méthode 1 échoue à cause du rate limit, essayer signInWithOtp
      if (!resendSuccess) {
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              shouldCreateUser: false, // Ne pas créer d'utilisateur, juste envoyer un email
            },
          });
          
          if (error) {
            console.error('❌ Erreur signInWithOtp:', error.message);
            lastError = error;
          } else {
            console.log('✅ Email renvoyé avec succès (méthode OTP)');
            resendSuccess = true;
          }
        } catch (err) {
          console.error('❌ Exception signInWithOtp:', err);
          lastError = err;
        }
      }
      
      // Méthode 3: Essayer avec email_change si les autres échouent
      if (!resendSuccess) {
        try {
          const { error } = await supabase.auth.resend({
            type: 'email_change',
            email: email,
          });
          
          if (error) {
            console.error('❌ Erreur resend email_change:', error.message);
            lastError = error;
          } else {
            console.log('✅ Email renvoyé avec succès (méthode email_change)');
            resendSuccess = true;
          }
        } catch (err) {
          console.error('❌ Exception resend email_change:', err);
          lastError = err;
        }
      }
      
      if (resendSuccess) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 8000); // Plus long pour laisser temps de recevoir
        
      // Nettoyer les logs pour la production
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email envoyé ! Vérifiez :');
        console.log('   1. Boîte de réception principale');
        console.log('   2. Dossier Spams/Pourriels');
        console.log('   3. Dossier Promotions');
        console.log('   4. Attendez 1-2 minutes pour la livraison');
      }
      } else {
        console.error('❌ Toutes les méthodes de renvoi ont échoué:', (lastError as any)?.message);
        
        // Message d'erreur utilisateur-friendly
        const errorMessage = (lastError as any)?.message || 'Erreur inconnue';
        if (errorMessage.includes('rate limit')) {
          alert('Veuillez patienter 1-2 minutes avant de renvoyer. Les emails peuvent prendre jusqu\'à 5 minutes pour arriver.');
        } else if (errorMessage.includes('User not found') || errorMessage.includes('Invalid email')) {
          alert('Email non trouvé. Vérifiez l\'adresse ou réinscrivez-vous.');
        } else {
          alert(`Erreur: ${errorMessage}. Veuillez réessayer plus tard ou contacter le support.`);
        }
      }
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Erreur générale resend:', error);
      }
      alert('Erreur lors du renvoi de l\'email. Veuillez réessayer plus tard.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-6 rounded-lg">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-custom/10 flex items-center justify-center"
            >
              <Mail className="w-8 h-8 text-rose-custom" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Vérifiez votre email
            </h1>
            
            <p className="text-gray-600 mb-4">
              Un email de confirmation a été envoyé à :
            </p>
            
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="font-medium text-rose-custom">
                {email || "votre@email.com"}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ouvrez votre boîte de réception</p>
                <p className="text-xs text-gray-500">Consultez votre email principal</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Cliquez sur le lien de confirmation</p>
                <p className="text-xs text-gray-500">Le lien est valable 24 heures</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Revenez sur cette page</p>
                <p className="text-xs text-gray-500">Vous serez redirigé automatiquement</p>
              </div>
            </div>
          </div>

          {resendSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-green-700 text-sm text-center font-medium">
                Email renvoyé avec succès !
              </p>
            </motion.div>
          )}

          <div className="space-y-3 mb-6">
            <button
              onClick={handleResendEmail}
              disabled={resendLoading || !email}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Renvoyer l'email
                </>
              )}
            </button>

            <Link
              href="/login"
              className="w-full bg-rose-custom text-white py-3 rounded-lg font-medium hover:bg-rose-custom/90 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-rose-custom hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p className="mb-1">Besoin d'aide ? Contactez notre support</p>
          <a href="mailto:contact@flocon-market.fr" className="text-rose-custom hover:underline font-medium">
            contact@flocon-market.fr
          </a>
        </div>
      </motion.div>
    </div>
  );
}
