import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Flocon - E-commerce de qualité",
    template: "%s | Flocon"
  },
  description: "Découvrez nos collections hivernales et de la Saint-Valentin. Produits artisanaux, cadeaux uniques et créations faites avec amour.",
  icons: {
    icon: '/logof.jpg',
    shortcut: '/logof.jpg',
    apple: '/logof.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
