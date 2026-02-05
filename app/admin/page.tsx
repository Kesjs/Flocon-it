"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers le dashboard
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter'] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-white" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
          Chargement du dashboard...
        </div>
      </div>
    </div>
  );
}
