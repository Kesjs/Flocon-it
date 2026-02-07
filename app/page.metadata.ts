import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Flocon - Cadeaux Saint-Valentin & Personnalisés | Livraison France",
  description: "✨ Cadeaux uniques pour la Saint-Valentin, anniversaires et moments spéciaux. Personnalisez avec vos photos. Livraison rapide en France. ❤️",
  keywords: "cadeaux saint valentin, cadeaux personnalisés, flocon market, cadeaux unique, valentin 2026, cadeaux amour, personnalisés photos",
  authors: [{ name: "Flocon Market" }],
  creator: "Flocon Market",
  publisher: "Flocon Market",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.flocon-market.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Flocon - Cadeaux d'Exception pour la Saint-Valentin ❤️",
    description: "Transformez vos souvenirs en cadeaux uniques. Cadeaux personnalisés pour la Saint-Valentin, anniversaires et moments spéciaux.",
    url: 'https://www.flocon-market.fr',
    siteName: 'Flocon Market',
    images: [
      {
        url: '/My-project-1-57.webp',
        width: 1200,
        height: 630,
        alt: 'Cadeaux Saint-Valentin Flocon Market',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flocon - Cadeaux Saint-Valentin & Personnalisés',
    description: '✨ Cadeaux uniques pour la Saint-Valentin. Personnalisez avec vos photos. Livraison France.',
    images: ['/My-project-1-57.webp'],
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
};
