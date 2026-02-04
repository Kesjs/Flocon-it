"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Building, Check, Copy, Shield, ArrowLeft, Package, Clock, CheckCircle, Info, Lock, Globe } from "lucide-react";
import Link from "next/link";

function FSTPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [copied, setCopied] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bankDetails = {
    beneficiary: "FLOCON MARKET SRL",
    iban: "IT60 X054 2811 1010 0000 0123 456",
    bic: "UNCRITM1XXX",
    bankName: "UniCredit S.p.A.",
    location: "Rome (Siège Europe)"
  };

  const copyToClipboard = async (text: string, type: string) => {
    if (!text || text.includes('undefined')) return;
    await navigator.clipboard.writeText(text);
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
      console.error('Erreur récupération commande:', error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased pb-20">
      {/* Barre de réassurance discrète */}
      <div className="bg-slate-50 border-b border-slate-100 py-3 px-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-slate-400" /> Transaction Sécurisée
          </div>
          <div className="flex items-center gap-2 font-medium italic">
            <Globe size={12} /> Réseau SEPA Européen
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 lg:py-16">
        <Link href="/checkout" className="inline-flex items-center text-slate-400 hover:text-slate-800 mb-10 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour au paiement
        </Link>
        
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* GAUCHE : COORDONNÉES BANCAIRES */}
          <div className="lg:col-span-3 space-y-8">
            <header>
              <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Virement Bancaire</h1>
              <p className="text-slate-500 text-base">
                Commande <span className="font-bold text-slate-900">#{orderId || '...'}</span> • En attente de transfert
              </p>
            </header>

            {/* Note de réassurance IBAN IT - Style Sobre */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-4 items-start">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Shield size={20} className="text-slate-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">Note aux clients français :</span> Flocon Market est une entreprise européenne. Ce virement est standard, sécurisé et sans frais de transaction (Règlement SEPA).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* BENEFICIAIRE */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 group hover:border-slate-300 transition-colors">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du bénéficiaire</label>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-slate-800 text-lg">{bankDetails.beneficiary}</span>
                  <button onClick={() => copyToClipboard(bankDetails.beneficiary, 'ben')} className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200">
                    {copied === 'ben' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-300" />}
                  </button>
                </div>
              </div>

              {/* IBAN */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 group hover:border-slate-300 transition-colors">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IBAN</label>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-mono text-base md:text-lg font-bold text-slate-800 tracking-tight italic">{bankDetails.iban}</span>
                  <button onClick={() => copyToClipboard(bankDetails.iban, 'iban')} className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200">
                    {copied === 'iban' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-300" />}
                  </button>
                </div>
              </div>

              {/* BIC / SWIFT */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 group hover:border-slate-300 transition-colors">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code BIC / SWIFT</label>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-mono text-base md:text-lg font-bold text-slate-800 tracking-widest uppercase">{bankDetails.bic}</span>
                  <button onClick={() => copyToClipboard(bankDetails.bic, 'bic')} className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200">
                    {copied === 'bic' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-300" />}
                  </button>
                </div>
              </div>

              {/* RÉFÉRENCE - STYLE NOIR INSTITUTIONNEL */}
              <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <label className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">Libellé à indiquer (Obligatoire)</label>
                    <div className="text-3xl font-black mt-1 tracking-wider uppercase">
                      {orderId ? `CMD-${orderId}` : "..."}
                    </div>
                  </div>
                  <button 
                    disabled={!orderId}
                    onClick={() => copyToClipboard(`CMD-${orderId}`, 'ref')} 
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all disabled:opacity-20"
                  >
                    {copied === 'ref' ? <Check size={22} /> : <Copy size={22} />}
                  </button>
                </div>
                {/* Note importante mise à jour (Sans bleu IA) */}
                <div className="mt-5 flex items-center gap-3 text-[11px] font-medium bg-white/5 border border-white/10 p-3 rounded-xl">
                  <Info size={16} className="text-emerald-400 shrink-0" />
                  <p>Inscrivez <span className="text-emerald-400 font-bold underline underline-offset-4">{orderId ? `CMD-${orderId}` : "votre référence"}</span> dans le libellé pour activer la validation sous 15 min.</p>
                </div>
              </div>
            </div>
          </div>

          {/* DROITE : RÉSUMÉ & ÉTAPES */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 lg:p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Package size={14} /> Récapitulatif
              </h3>
              
              <div className="space-y-4 mb-8">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
                  </div>
                ) : (
                  order?.products?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm items-center border-b border-slate-100 pb-3 last:border-0">
                      <div className="max-w-[70%]">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">Quantité: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-slate-900">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase mb-1 leading-none">Total à transférer</span>
                <span className="text-3xl font-black text-slate-900 leading-none tracking-tighter">
                  {order?.total ? `${order.total.toFixed(2)}€` : '...'}
                </span>
              </div>

              {/* Étapes claires */}
              <div className="mt-10 space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 font-mono italic">1</div>
                  <p className="text-xs text-slate-600 leading-snug">Ajoutez le compte <span className="font-bold text-slate-800">Flocon Market</span> à vos bénéficiaires.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 font-mono italic">2</div>
                  <p className="text-xs text-slate-600 leading-snug">Effectuez le virement en indiquant bien la référence dans le <span className="font-bold text-slate-800 italic">libellé</span>.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    <CheckCircle size={12} />
                  </div>
                  <p className="text-xs text-slate-600 leading-snug italic font-medium">Votre commande sera expédiée dès réception (5-15 min pour les virements instantanés).</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
              <Building size={20} className="text-slate-300 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banque Partenaire</p>
                <p className="text-xs font-bold text-slate-700">{bankDetails.bankName}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function FSTPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>}>
      <FSTPageContent />
    </Suspense>
  );
}