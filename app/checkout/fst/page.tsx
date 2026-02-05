"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Check, Copy, Shield, ArrowLeft, Info, Lock, Globe, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

function FSTPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [copied, setCopied] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      }
    } catch (error) { 
      console.error('Erreur:', error); 
    } finally { 
      setIsLoading(false); 
    }
  };

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
                    {order?.total ? order.total.toFixed(2) : "0.00"}€
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

                  <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95 shadow-lg">
                    J'ai effectué le virement
                    <ArrowRight size={18} />
                  </button>
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