"use client";

import { Shield } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-6">
          <Shield className="w-10 h-10 text-white animate-pulse" />
        </div>
        <div className="text-white text-lg">Chargement de l'administration...</div>
      </div>
    </div>
  );
}
