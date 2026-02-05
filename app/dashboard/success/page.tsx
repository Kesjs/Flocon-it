"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ArrowRight, Clock, Mail, Shield } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // Récupérer les infos de la commande depuis les params ou localStorage
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');
    
    if (orderId && amount) {
      setOrderInfo({ orderId, amount });
    } else {
      // Essayer de récupérer depuis le localStorage
      const stored = localStorage.getItem('fst_success_info');
      if (stored) {
        setOrderInfo(JSON.parse(stored));
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter'] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-6"
      >
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check size={48} className="text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-black text-slate-900 mb-4">
              Paiement Confirmé !
            </h1>
            
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-6">
              Votre virement a été validé par notre équipe
            </div>
          </div>

          {/* Order Info */}
          {orderInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-50 rounded-xl p-6 mb-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Commande
                  </div>
                  <div className="font-semibold text-slate-900">
                    #{orderInfo.orderId}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                    Montant
                  </div>
                  <div className="font-black text-xl text-slate-900">
                    {parseFloat(orderInfo.amount).toFixed(2)}€
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Virement déclaré</div>
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Vous avez déclaré votre virement
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">En attente de validation</div>
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  Notre équipe vérifiait votre paiement
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Paiement confirmé</div>
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-green-600">
                  Votre paiement a été validé avec succès
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <Mail size={20} className="text-blue-600" />
              <div className="font-semibold text-slate-900">Prochaines étapes</div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600 space-y-2">
              <div>• Un email de confirmation vous a été envoyé</div>
              <div>• Votre commande sera préparée immédiatement</div>
              <div>• Vous recevrez un email de suivi dans les 24h</div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <Link
              href="/dashboard"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 font-black transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Mon Tableau de Bord
              <ArrowRight size={16} />
            </Link>
            
            <Link
              href="/"
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-200/60 text-slate-900 rounded-xl py-3 font-black transition-all active:scale-95"
            >
              Continuer mes Achats
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
