"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function ConfirmEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Récupérer les tokens depuis l'URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (!accessToken || !refreshToken) {
          setStatus('error');
          setMessage("Lien de confirmation invalide ou expiré.");
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // Créer le client Supabase et confirmer l'email
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        // Authentifier avec les tokens reçus
        if (!supabase) {
          setStatus('error');
          setMessage("Erreur de configuration. Veuillez réessayer.");
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setStatus('error');
          setMessage("Erreur lors de la confirmation. Veuillez réessayer.");
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // Vérifier si l'email est maintenant confirmé
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email_confirmed_at) {
          setStatus('success');
          setMessage("Email confirmé avec succès ! Redirection vers votre tableau de bord...");
          
          // Rediriger vers le dashboard après 2 secondes
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage("La confirmation a échoué. Veuillez contacter le support.");
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Erreur confirmation email:', error);
        setStatus('error');
        setMessage("Une erreur est survenue. Veuillez réessayer.");
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-iceBlue/20 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-6"
            >
              <RefreshCw className="w-full h-full text-rose-custom animate-spin" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-textDark mb-4">
              Confirmation en cours...
            </h1>
            <p className="text-gray-600">
              Nous confirmons votre adresse email. Veuillez patienter quelques instants.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-textDark mb-4">
              Confirmation réussie !
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 2, ease: "linear" }}
                className="h-full bg-rose-custom"
              />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center"
            >
              <AlertCircle className="w-8 h-8 text-red-600" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-textDark mb-4">
              Erreur de confirmation
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-red-500"
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function ConfirmEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
