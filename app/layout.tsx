import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProviderWrapper from "@/components/CartProviderWrapper";
import { AuthProvider } from "@/context/AuthContext";
import AnnounceBar from "@/components/AnnounceBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Flocon - E-commerce de qualité",
  description: "Découvrez nos collections hivernales et de la Saint-Valentin",
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
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CartProviderWrapper>
            <AnnounceBar />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
