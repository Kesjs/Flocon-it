"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FloconAdminHeader from "@/components/FloconAdminHeader";

export default function FloconAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est bien admin
    const token = localStorage.getItem('flocon_admin_token');
    
    if (!token) {
      router.push('/Flocon/admin/login');
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900">
      <FloconAdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
