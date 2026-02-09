/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 300,  // Cache 5 minutes pour images externes lentes
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'alpesdusud.ch',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'babyfive.ma',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.goldengames.ma',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.maisoncashmere.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lespetitsimprimes.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cdiscount.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mycrazystuff.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.emmafashionstyle.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.fruugo.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.yslbeauty.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.maisondpm.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cadeau-couple.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.brut-de-champ.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mongraindesucre.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placeducouple.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lemondedescadeaux.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.maisonfans.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'boutique-rose-eternelle.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'made-in-china.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ma.jumia.is',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nouvojour.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ae01.alicdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.truffaut.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hamac.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gowood.ca',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'semarome.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'creationsettradition.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.manomano.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.cimalp.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.objetrama.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.made-in-china.com',
        pathname: '/**',
      },
    ],
    loader: 'default',
    qualities: [75, 80, 90, 95],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
  // Optimisations pour éviter les ChunkLoadError
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: -30,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  // Ajouter le middleware pour l'admin Flocon
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/Flocon/admin/:path*',
      },
    ];
  },
}

module.exports = nextConfig
