"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Check, Copy, Shield, ArrowLeft, Info, Lock, Globe, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from "@/lib/supabase";

// Créer une instance unique pour éviter les multiples instances
const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function FSTPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [copied, setCopied] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour la déclaration de paiement
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  // Fonctions utilitaires pour la synchronisation
  const getLocalStorageOrder = (orderId: string) => {
    if (typeof window === 'undefined') return null;
    
    const storedOrders = localStorage.getItem('flocon_orders');
    if (!storedOrders) return null;
    
    const orders = JSON.parse(storedOrders);
    return orders.find((o: any) => o.id === orderId);
  };

  const syncOrderToSupabase = async (order: any) => {
    console.log('🔄 Synchronisation commande vers Supabase:', order.id);
    
    try {
      const response = await fetch('/api/orders/sync-from-localstorage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderId: order.id,
          orderData: order
        }),
      });

      if (response.ok) {
        console.log('✅ Commande synchronisée avec Supabase');
      } else {
        console.log('⚠️ Échec synchronisation Supabase');
      }
    } catch (error) {
      console.error('❌ Erreur synchronisation:', error);
    }
  };

  const bankDetails = {
    beneficiary: "GIULIO SALVADORI",
    iban: "IT92 M360 8105 1382 4505 7545 064",
    bic: "PPAYITR1XXX",
    bankName: "POSTEPAY S.P.A.",
    location: "Italie",
    transferType: "SEPA Instant / Standard",
    reason: "Paiement de facture sécurisé"
  };

  const copyToClipboard = async (text: string, type: string) => {
    if (!text || text.includes('undefined')) return;
    // Nettoyage automatique des espaces pour l'IBAN lors de la copie
    const textToCopy = type === 'iban' ? text.replace(/\s/g, '') : text;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      return;
    }

    setIsLoading(false);
    setError('ID de commande manquant');
    setOrder(null);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError('');
    setOrder(null);
    console.log('🔍 Récupération commande pour ID:', orderId);

    if (!orderId) {
      setError('ID de commande manquant');
      setIsLoading(false);
      return;
    }

    try {
      let apiResponse: Response | null = null;

      // 🗄️ Essayer Supabase d'abord
      try {
        apiResponse = await fetch(`/api/orders/${orderId}`);
        console.log('📡 Response status Supabase:', apiResponse.status);

        if (apiResponse.ok) {
          const orderData = await apiResponse.json();
          console.log('✅ Commande trouvée dans Supabase:', orderData.order);
          
          // Si la commande Supabase n'a pas d'adresse, essayer de la compléter depuis localStorage
          let finalOrder = orderData.order;
          if (!finalOrder.shipping_address || !finalOrder.shipping_address.address_line1) {
            console.log('🔄 Adresse manquante dans Supabase, recherche localStorage...');
            const localStorageOrder = getLocalStorageOrder(orderId);
            if (localStorageOrder && localStorageOrder.shippingAddress) {
              finalOrder = {
                ...finalOrder,
                shipping_address: {
                  full_name: localStorageOrder.shippingAddress.name,
                  address_line1: localStorageOrder.shippingAddress.address,
                  city: localStorageOrder.shippingAddress.city,
                  postal_code: localStorageOrder.shippingAddress.postalCode,
                  country: 'FR',
                  phone: localStorageOrder.shippingAddress.phone
                },
                customer_name: localStorageOrder.shippingAddress.name,
                customer_phone: localStorageOrder.shippingAddress.phone
              };
              console.log('✅ Adresse complétée depuis localStorage');
            }
          }
          
          setOrder(finalOrder);
          return;
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase indisponible, fallback localStorage');
      }

      // 🔄 Fallback : localStorage
      console.log('🔄 Tentative récupération depuis localStorage...');
      const storedOrders = localStorage.getItem('flocon_orders');
      console.log('📦 Orders dans localStorage:', storedOrders);

      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        const storedOrder = orders.find((o: any) => o.id === orderId);

        if (storedOrder) {
          console.log('✅ Commande trouvée dans localStorage:', storedOrder);
          
          // Convertir le format localStorage vers le format Supabase
          const convertedOrder = {
            ...storedOrder,
            user_email: user?.email || 'client@flocon-boutique.com',
            shipping_address: {
              full_name: storedOrder.shippingAddress.name,
              address_line1: storedOrder.shippingAddress.address,
              city: storedOrder.shippingAddress.city,
              postal_code: storedOrder.shippingAddress.postalCode,
              country: 'FR',
              phone: storedOrder.shippingAddress.phone
            },
            customer_name: storedOrder.shippingAddress.name,
            customer_phone: storedOrder.shippingAddress.phone,
            fst_status: storedOrder.fst_status || 'pending',
            payment_declared_at: storedOrder.payment_declared_at
          };
          
          setOrder(convertedOrder);
          
          // Tenter de synchroniser avec Supabase
          try {
            await syncOrderToSupabase(convertedOrder);
          } catch (syncError) {
            console.log('⚠️ Synchronisation Supabase échouée:', syncError);
          }
          
          return;
        }
      }

      if (apiResponse?.status === 404) {
        setError('Commande introuvable');
        return;
      }

      setError('Impossible de récupérer la commande. Veuillez réessayer.');
    } catch (error) {
      console.error('💥 Erreur fetchOrderDetails:', error);
      setError('Impossible de récupérer la commande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclarePayment = async () => {
    console.log('🔍 Début handleDeclarePayment avec supabaseClient unique');
    console.log('📋 OrderID:', orderId);
    
    if (!orderId) {
      setError('ID de commande manquant');
      return;
    }

    setIsDeclaring(true);
    setError('');

    try {
      // Utiliser l'instance unique supabaseClient
      console.log('🔍 Utilisation de supabaseClient:', supabaseClient);
      
      // Utiliser getUser() (force vérification serveur)
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      console.log('👤 User from getUser():', user);
      console.log('❌ User error from getUser():', userError);
      
      if (userError || !user || !user.email) {
        console.log('🚫 getUser() a échoué - tentative refreshSession()');
        
        // Vérifier si un cookie sb-access-token existe
        const cookies = document.cookie.split(';');
        const hasSbCookie = cookies.some(cookie => cookie.trim().startsWith('sb-access-token'));
        console.log('🍪 Cookie sb-access-token trouvé:', hasSbCookie);
        
        if (hasSbCookie) {
          console.log('🔄 Tentative refreshSession()...');
          const { data: { session }, error: refreshError } = await supabaseClient.auth.refreshSession();
          
          console.log('🔄 Refresh session result:', session);
          console.log('❌ Refresh session error:', refreshError);
          
          if (refreshError || !session || !session.user) {
            console.log('🚫 refreshSession() a échoué - redirection vers login');
            setError('Session expirée. Redirection...');
            setTimeout(() => {
              router.push('/login');
            }, 2000);
            return;
          }
          
          // Utiliser la session rafraîchie
          const token = session.access_token;
          console.log('🎫 Token après refresh:', token ? 'présent' : 'manquant');
          
          if (!token) {
            setError('Session sans token. Veuillez vous reconnecter.');
            return;
          }

          // Continuer avec le token rafraîchi
          await callDeclareAPI(orderId, token, setError, setIsSuccess, router);
          return;
        }
        
        console.log('🚫 Pas de cookie - redirection vers login');
        setError('Vous devez être connecté. Redirection...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      // Utiliser la session de getUser()
      const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
      const token = session?.access_token;
      
      console.log('📧 Session from getSession():', session);
      console.log('🎫 Token:', token ? 'présent' : 'manquant');

      if (!token) {
        console.log('🚫 Pas de token dans la session');
        setError('Session sans token. Veuillez vous reconnecter.');
        return;
      }

      // Continuer avec le token
      await callDeclareAPI(orderId, token, setError, setIsSuccess, router);
      
    } catch (error) {
      console.error('💥 Erreur catch:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsDeclaring(false);
    }
  };

  // Fonction séparée pour l'appel API
  const callDeclareAPI = async (orderId: string, token: string, setError: Function, setIsSuccess: Function, router: any) => {
    console.log('📡 Appel API /api/declare-payment');
    
    const response = await fetch('/api/declare-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    });

    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (response.ok && data.success) {
      console.log('✅ Succès - redirection vers page succès FST');
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/checkout/success-fst?order_id=${orderId}`);
      }, 3000);
    } else {
      console.log('❌ Erreur API:', data.error);
      setError(data.error || 'Erreur lors de la déclaration du paiement');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans antialiased pb-20">
        <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/checkout" className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              RETOUR
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              CONNEXION BANCAIRE SÉCURISÉE
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Info size={18} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-900 mb-2">
                  Impossible d'afficher la commande
                </h1>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {error}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={fetchOrderDetails}
                    className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                  >
                    Retour au checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans antialiased pb-20">
      {/* BARRE DE NAVIGATION MINIMALISTE */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/checkout" className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            RETOUR
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-widest">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            CONNEXION BANCAIRE SÉCURISÉE
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <header className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-slate-900 mb-6">
            Finalisez votre transfert <span className="text-slate-300 font-light italic">FST</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            Référence commande <span className="text-slate-900 font-bold underline decoration-slate-200 decoration-2">#{orderId || '...'}</span>. 
            Le virement doit être effectué depuis votre application bancaire habituelle.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* GAUCHE : DÉTAILS BANCAIRES (LOOK INSTITUTIONNEL) */}
          <div className="lg:col-span-7 space-y-10">
            
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group">
              {/* Filigrane discret */}
              <Building size={200} className="absolute -right-10 -bottom-10 text-slate-50 opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-10">
                <BankField 
                  label="Bénéficiaire" 
                  value={bankDetails.beneficiary} 
                  isCopied={copied === 'ben'} 
                  onCopy={() => copyToClipboard(bankDetails.beneficiary, 'ben')} 
                />
                
                <BankField 
                  label="IBAN Européen (Zone SEPA)" 
                  value={bankDetails.iban} 
                  isCopied={copied === 'iban'} 
                  onCopy={() => copyToClipboard(bankDetails.iban, 'iban')} 
                  mono 
                  large
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <BankField 
                    label="Code BIC / SWIFT" 
                    value={bankDetails.bic} 
                    isCopied={copied === 'bic'} 
                    onCopy={() => copyToClipboard(bankDetails.bic, 'bic')} 
                    mono 
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Établissement</label>
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                        <Building size={18} className="text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{bankDetails.bankName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row gap-6">
                   <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Libellé à indiquer (Critique)</label>
                      <div 
                        onClick={() => copyToClipboard(`CMD-${orderId}`, 'ref')}
                        className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${copied === 'ref' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'}`}
                      >
                        <span className="font-mono font-bold tracking-widest text-lg">CMD-{orderId}</span>
                        {copied === 'ref' ? <Check size={20} className="text-emerald-600" /> : <Copy size={18} className="opacity-50" />}
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Note d'information sobre */}
            <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <Info size={20} className="text-slate-400 flex-shrink-0 mt-1" />
              <p className="text-sm text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-900">Localisation du compte :</span> Notre centre de gestion est basé en Italie. Ce transfert utilise le réseau <span className="font-bold">SEPA</span> : il est gratuit, sécurisé et régi par les normes bancaires de l'UE.
              </p>
            </div>
          </div>

          {/* DROITE : TOTAL & RÉASSURANCE */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Montant de la transaction</p>
                  <div className="text-6xl font-medium tracking-tighter mb-10">
                    {typeof order?.total !== 'undefined' && Number.isFinite(Number(order?.total))
                      ? `${Number(order?.total).toFixed(2)}€`
                      : '—'}
                  </div>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-sm text-slate-400">Délai estimé</span>
                      <span className="text-sm font-bold">Instantané — 24h</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-sm text-slate-400">Frais bancaires</span>
                      <span className="text-sm font-bold text-emerald-400 underline decoration-emerald-400/30">0.00€ (Inclus)</span>
                    </div>
                  </div>

                  {/* Bouton de déclaration */}
                  {isSuccess ? (
                    <button 
                      disabled
                      className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed"
                    >
                      <Check size={20} />
                      Paiement déclaré avec succès
                    </button>
                  ) : (
                    <button 
                      onClick={handleDeclarePayment}
                      disabled={isDeclaring || !order}
                      className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${
                        isDeclaring || !order
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-white text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {isDeclaring ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          PAIEMENT EFFECTUÉ
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  )}

                  {/* Message d'erreur */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                        <Info size={12} className="text-red-600" />
                      </div>
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Message de succès */}
                  {isSuccess && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-700 font-medium">Transfert déclaré avec succès</p>
                        <p className="text-xs text-emerald-600">Redirection vers la page de confirmation...</p>
                      </div>
                    </div>
                  )}
               </div>
            </div>

            {/* GARANTIES FINALES (MONOCHROME) */}
            <div className="space-y-3">
              <GarantieItem icon={<Shield size={20} />} title="Protection Européenne" desc="Fonds garantis par la directive PSD2." />
              <GarantieItem icon={<Lock size={20} />} title="Cryptage de bout en bout" desc="Vos données ne sont jamais stockées." />
              <GarantieItem icon={<Globe size={20} />} title="Traitement Prioritaire" desc="Validation dès réception des fonds." />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// COMPOSANTS INTERNES
function BankField({ label, value, isCopied, onCopy, mono = false, large = false }: any) {
  return (
    <div className="flex flex-col gap-3 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div 
        onClick={onCopy}
        className={`flex justify-between items-center p-1 cursor-pointer transition-all ${isCopied ? 'text-emerald-600' : 'text-slate-900 hover:text-slate-600'}`}
      >
        <span className={`${mono ? 'font-mono tracking-tighter' : 'font-medium'} ${large ? 'text-xl md:text-3xl' : 'text-lg'}`}>
          {value}
        </span>
        <div className={`p-2 rounded-full transition-colors ${isCopied ? 'bg-emerald-50' : 'bg-transparent text-slate-300'}`}>
          {isCopied ? <Check size={20} /> : <Copy size={20} />}
        </div>
      </div>
    </div>
  );
}

function GarantieItem({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-3xl group hover:border-slate-300 transition-colors">
      <div className="text-slate-300 group-hover:text-slate-900 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider leading-none mb-1">{title}</h4>
        <p className="text-[11px] text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}

export default function FSTPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFCFB]" />}>
      <FSTPageContent />
    </Suspense>
  );
}
