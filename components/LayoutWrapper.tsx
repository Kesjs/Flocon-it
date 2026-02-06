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
import { RedirectLoader } from "@/components/ui/RedirectLoader";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/Flocon/admin') || pathname?.startsWith('/admin');
  
  // Pages qui nécessitent le panier (boutique, collections, accueil, etc.)
  const needsCart = [
    '/',
    '/boutique',
    '/checkout',
    '/cart',
    '/hiver',
    '/occasions',
    '/saint-valentin'
  ].some(path => pathname?.includes(path) || pathname === path);

  return (
    <NProgressProvider>
      {isAdminRoute ? (
        // Layout admin - pas de header/footer
        <div className="min-h-screen bg-[#F9FAFB]">
          {children}
        </div>
      ) : (
        // Layout normal du site
        <ClientLayoutWrapper>
          <AuthProvider>
            {needsCart ? (
              <CartProviderWrapper>
                <AnnounceBar />
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <CookieBanner />
                <RedirectLoader />
              </CartProviderWrapper>
            ) : (
              <>
                <AnnounceBar />
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <CookieBanner />
                <RedirectLoader />
              </>
            )}
          </AuthProvider>
        </ClientLayoutWrapper>
      )}
    </NProgressProvider>
  );
}
