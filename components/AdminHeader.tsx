"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, LogOut, Menu, X, Home, Users, Package, Settings, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const [adminEmail, setAdminEmail] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const email = localStorage.getItem('admin_email');
    
    if (!token || !email) {
      router.push('/admin/login');
      return;
    }
    
    setAdminEmail(email);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/admin/orders', icon: Home },
    { name: 'Commandes', href: '/dashboard/admin/orders', icon: Package },
    { name: 'Clients', href: '/dashboard/admin/customers', icon: Users },
    { name: 'Paramètres', href: '/dashboard/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Header Desktop */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et navigation */}
            <div className="flex items-center">
              <Link href="/dashboard/admin/orders" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-white">Admin Flocon</span>
              </Link>
              
              {/* Navigation desktop */}
              <nav className="hidden md:flex items-center gap-6 ml-10">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800"
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
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Menu utilisateur */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-400">Admin</p>
                  <p className="text-sm font-medium text-white">{adminEmail}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              </div>

              {/* Bouton logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>

              {/* Menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
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
            className="md:hidden bg-gray-800 border-t border-gray-700"
          >
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-400">Admin</p>
                  <p className="text-sm font-medium text-white">{adminEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors w-full"
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
