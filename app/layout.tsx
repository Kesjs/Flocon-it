import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnounceBar from "@/components/AnnounceBar";
import CartProviderWrapper from "@/components/CartProviderWrapper";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Flocon - E-commerce de qualité",
  description: "Découvrez nos collections hiver et Saint-Valentin",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/favicon.svg' }
    ],
    shortcut: '/favicon.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ErrorBoundaryWrapper>
          <AuthProvider>
            <CartProviderWrapper>
              <NextTopLoader 
                color="#f87171" 
                height={3}
                showSpinner={false}
                shadow={false}
                zIndex={160}
              />
              <AnnounceBar />
              <Header />
              <main className="min-h-screen pt-20">{children}</main>
              <Footer />
            </CartProviderWrapper>
          </AuthProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
