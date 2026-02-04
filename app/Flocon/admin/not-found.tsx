"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">404</h1>
        <p className="text-gray-400 mb-8">Page admin non trouvée</p>
        <Link
          href="/Flocon/admin/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'admin
        </Link>
      </div>
    </div>
  );
}
