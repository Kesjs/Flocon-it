"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, LogOut, Menu, X, Home, Users, Package, Settings, Bell, TrendingUp, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function FloconAdminHeader() {
  const [adminEmail, setAdminEmail] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('flocon_admin_token');
    const email = localStorage.getItem('flocon_admin_email');
    
    if (!token || !email) {
      router.push('/Flocon/admin/login');
      return;
    }
    
    setAdminEmail(email);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('flocon_admin_token');
    localStorage.removeItem('flocon_admin_email');
    router.push('/Flocon/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/Flocon/admin/dashboard', icon: Home },
    { name: 'Commandes FST', href: '/Flocon/admin/orders', icon: CreditCard },
    { name: 'Clients', href: '/Flocon/admin/customers', icon: Users },
    { name: 'Paramètres', href: '/Flocon/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Header Desktop */}
      <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et navigation */}
            <div className="flex items-center">
              <Link href="/Flocon/admin/dashboard" className="flex items-center gap-3">
                <div>
                  <span className="text-xl font-black text-white">Flocon</span>
                  <span className="text-xl font-black text-red-500">Admin</span>
                </div>
              </Link>
              
              {/* Navigation desktop */}
              <nav className="hidden lg:flex items-center gap-2 ml-10">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Menu utilisateur */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-gray-400">Administrateur</p>
                  <p className="text-sm font-medium text-white">{adminEmail}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              </div>

              {/* Bouton logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-red-900/30 rounded-lg transition-all duration-200 border border-red-900/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>

              {/* Menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800"
          >
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-slate-700 pt-3 mt-3">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-400">Administrateur</p>
                  <p className="text-sm font-medium text-white">{adminEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-red-900/30 px-3 py-2 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}
