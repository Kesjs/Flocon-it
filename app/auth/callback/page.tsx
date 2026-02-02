"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      // Rediriger vers la page de login avec l'erreur
      router.push(`/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || 'Erreur de confirmation')}`);
    } else if (code) {
      // Traiter le code de confirmation
      router.push('/login?confirmed=true&message=Email confirmé avec succès');
    } else {
      // Pas de code ni d'erreur
      router.push('/login?error=invalid_code&description=Aucun code de confirmation trouvé');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-custom mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Confirmation en cours...
        </h2>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous confirmons votre email.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Vous serez redirigé automatiquement.
        </p>
      </div>
    </div>
  );
}
