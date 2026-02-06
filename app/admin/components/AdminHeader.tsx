"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, LogOut, User, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationPanel } from "@/components/admin/NotificationSystem";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminHeader() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Récupérer les infos admin depuis la session
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch('/api/admin/auth');
        const data = await response.json();
        
        if (data.authenticated) {
          setAdmin(data.admin);
        }
      } catch (error) {
        console.error('Erreur récupération infos admin:', error);
      }
    };

    fetchAdminInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                Command Center
              </h1>
              <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                Administration FST
              </div>
            </div>
          </div>

          {/* Actions à droite */}
          <div className="flex items-center gap-4">
            {/* Système de notifications intégré */}
            <NotificationPanel />

            {/* Paramètres */}
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Settings size={18} className="text-slate-600" />
            </button>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {admin ? (
                  <>
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-slate-600" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-900">
                        {admin.firstName} {admin.lastName}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        {admin.role}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-slate-600" />
                  </div>
                )}
              </button>

              {/* Menu déroulant */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-slate-200/60 shadow-lg z-50"
                >
                  <div className="p-4 border-b border-slate-100">
                    <div className="text-sm font-semibold text-slate-900">
                      {admin?.firstName} {admin?.lastName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {admin?.email}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-green-600 mt-1">
                      {admin?.role}
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-3">
                      <Settings size={16} className="text-slate-600" />
                      <span className="text-sm text-slate-700">Paramètres</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
