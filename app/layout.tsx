import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProviderWrapper from "@/components/CartProviderWrapper";
import { AuthProvider } from "@/context/AuthContext";
import AnnounceBar from "@/components/AnnounceBar";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import CookieBanner from "@/components/CookieBanner";

// Try to load Inter font with fallback
let inter: { className: string };
try {
  const { Inter } = require('next/font/google');
  inter = Inter({ 
    subsets: ['latin'],
    display: 'swap',
    fallback: ['system-ui', 'arial', 'sans-serif']
  });
} catch (error) {
  // Fallback if Google Fonts fails
  inter = { className: '' };
}


export const metadata: Metadata = {
  title: {
    default: "Flocon - E-commerce de qualité",
    template: "%s | Flocon"
  },
  description: "Découvrez nos collections hivernales et de la Saint-Valentin. Produits artisanaux, cadeaux uniques et créations faites avec amour.",
  keywords: ["e-commerce", "cadeaux", "saint-valentin", "hiver", "artisanat", "décoration", "flocon"],
  authors: [{ name: "Flocon" }],
  creator: "Flocon",
  publisher: "Flocon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://flocon.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'Flocon - E-commerce de qualité',
    description: 'Découvrez nos collections hivernales et de la Saint-Valentin',
    siteName: 'Flocon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flocon - E-commerce de qualité',
    description: 'Découvrez nos collections hivernales et de la Saint-Valentin',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/logof.jpg', type: 'image/jpeg' }
    ],
    apple: [
      { url: '/logof.jpg' }
    ],
    shortcut: '/logof.jpg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logof.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logof.jpg" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
