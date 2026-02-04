"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProviderWrapper from "@/components/CartProviderWrapper";
import { AuthProvider } from "@/context/AuthContext";
import AnnounceBar from "@/components/AnnounceBar";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import CookieBanner from "@/components/CookieBanner";
import NProgressProvider from "@/components/NProgressProvider";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/Flocon/admin');

  return (
    <NProgressProvider>
      {isAdminRoute ? (
        // Layout admin - pas de header/footer
        <div className="min-h-screen bg-slate-900">
          {children}
        </div>
      ) : (
        // Layout normal du site
        <ClientLayoutWrapper>
          <AuthProvider>
            <CartProviderWrapper>
              <AnnounceBar />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <CookieBanner />
            </CartProviderWrapper>
          </AuthProvider>
        </ClientLayoutWrapper>
      )}
    </NProgressProvider>
  );
}
