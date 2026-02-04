"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est bien admin
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
