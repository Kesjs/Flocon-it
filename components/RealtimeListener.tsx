"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface RealtimeListenerProps {
  onNewPayment?: (payment: any) => void;
  onPaymentConfirmed?: (data: any) => void;
  userId?: string;
}

export default function RealtimeListener({ onNewPayment, onPaymentConfirmed, userId }: RealtimeListenerProps) {
  const router = useRouter();

  useEffect(() => {
    // Écouter les nouvelles déclarations FST
    if (!supabase) {
      console.log('❌ Supabase non disponible pour RealtimeListener');
      return;
    }
    
    const fstChannel = supabase
      .channel('fst-declarations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: 'fst_status=eq.declared'
        },
        (payload) => {
          console.log('Nouveau paiement FST détecté:', payload);
          if (onNewPayment) {
            onNewPayment(payload.new);
          }
        }
      )
      .subscribe();

    // Écouter les confirmations de paiement
    const confirmationChannel = supabase
      .channel('payment-confirmations')
      .on('broadcast', { event: 'payment_confirmed' }, (payload) => {
        console.log('Paiement confirmé:', payload);
        
        // Si c'est pour l'utilisateur connecté, rediriger vers la page de succès
        if (userId && payload.payload.user_email === userId) {
          setTimeout(() => {
            router.push(`/dashboard/success?order_id=${payload.payload.orderId}&amount=${payload.payload.amount}`);
          }, 1000);
        }
        
        if (onPaymentConfirmed) {
          onPaymentConfirmed(payload.payload);
        }
      })
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(fstChannel);
        supabase.removeChannel(confirmationChannel);
      }
    };
  }, [onNewPayment, onPaymentConfirmed, userId, router]);

  return null; // Composant invisible
}
