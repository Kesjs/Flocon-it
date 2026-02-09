"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Check, ArrowLeft, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      // Pas de session_id - rediriger vers la page checkout ou accueil
      const timer = setTimeout(() => {
        router.push('/checkout');
      }, 3000); // Attendre 3 secondes avant la redirection

      return () => clearTimeout(timer);
    }

    // Récupérer les vraies données de la session Stripe
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/get-session?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok) {
          setOrderDetails(data.orderDetails);
        } else {
          console.error('Erreur:', data.error);
          // En cas d'erreur, afficher des données par défaut
          setOrderDetails({
            id: sessionId,
            status: 'Payée',
            email: 'Non disponible',
            total: 0,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
        // En cas d'erreur, afficher des données par défaut
        setOrderDetails({
          id: sessionId,
          status: 'Payée',
          email: 'Non disponible',
          total: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, router]);

  if (isLoading && !sessionId) {
    return (
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-textDark mb-4">
            Accesso non valido
          </h1>
          <p className="text-gray-600 mb-4">
            Questa pagina è accessibile solo dopo un pagamento riuscito.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Sarai reindirizzato alla pagina di pagamento tra 3 secondi...
          </p>
          <Link
            href="/checkout"
            className="inline-block bg-rose-custom text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-custom/90 transition-colors"
          >
            Torna al pagamento
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dettagli ordine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-textDark mb-4">
          Pagamento riuscito!
        </h1>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h2 className="font-semibold text-textDark mb-3">Dettagli ordine</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 flex-shrink-0">Numero ordine:</span>
              <div className="text-right ml-2">
                <span className="font-medium block">
                  {orderDetails?.id ? `CMD-${orderDetails.id.substring(0, 8)}...` : 'N/A'}
                </span>
                <span className="text-xs text-gray-500 block" style={{wordBreak: 'break-all', maxWidth: '200px'}}>
                  {orderDetails?.id}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stato:</span>
              <span className={`font-medium ${
                orderDetails?.status === 'Payée' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {orderDetails?.status === 'Payée' ? 'Pagamento effettuato' : 'Pagamento non effettuato'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 flex-shrink-0">Email:</span>
              <span className="font-medium text-right break-all ml-2" style={{wordBreak: 'break-all', maxWidth: '200px'}}>
                {orderDetails?.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Totale:</span>
              <span className="font-bold text-lg">{orderDetails?.total?.toFixed(2)} €</span>
            </div>
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-gray-600 mb-2">Articoli ordinati:</p>
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="flex-1 mr-2" style={{wordBreak: 'break-word'}}>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="flex-shrink-0">{item.price.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Grazie per il tuo ordine! Riceverai un'email di conferma a breve con i dettagli di spedizione.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-rose-custom to-iceBlue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Vedi i miei ordini
          </Link>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline"
          >
            <ShoppingBag className="w-4 h-4" />
            Continua i tuoi acquisti
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-custom border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
