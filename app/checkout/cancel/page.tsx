"use client";

import { ArrowLeft, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <div className="pt-28 min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-orange-600" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-textDark mb-4">
          Paiement annulé
        </h1>
        
        <p className="text-gray-600 mb-6">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            Vous pouvez réessayer le paiement ou modifier votre commande si nécessaire.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-gradient-to-r from-rose-custom to-iceBlue text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Réessayer le paiement
          </Link>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline"
          >
            <ShoppingBag className="w-4 h-4" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
