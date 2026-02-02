/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    scrollRestoration: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['localhost'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    disableStaticImages: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.leclapstore.com',
        pathname: '/**',
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
      },
      {
        protocol: 'https',
        hostname: 'www.cdiscount.com',
      },
      {
        protocol: 'https',
        hostname: 'mycrazystuff.com',
      },
      {
        protocol: 'https',
        hostname: 'www.emmafashionstyle.fr',
      },
      {
        protocol: 'https',
        hostname: 'img.fruugo.com',
      },
      {
        protocol: 'https',
        hostname: 'www.yslbeauty.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.maisondpm.fr',
      },
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
      },
      {
        protocol: 'https',
        hostname: 'cadeau-couple.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.brut-de-champ.com',
      },
      {
        protocol: 'https',
        hostname: 'mongraindesucre.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'placeducouple.com',
      },
      {
        protocol: 'https',
        hostname: 'lemondedescadeaux.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.maisonfans.com',
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
        hostname: 'amazon.com',
        pathname: '/**',
      },
    ],
    loader: 'custom',
    loaderFile: './image-loader.js',
    qualities: [75, 90, 95],
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
}

module.exports = nextConfig
