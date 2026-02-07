const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["stripe", "playwright"],

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: "default",
    disableStaticImages: false,
    // Allow images from the same origin (for public folder assets)
    remotePatterns: [],
    // Ensure static images work in production
    domains: [],
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },

  // Turbopack configuration
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Compression
  compress: true,

  // Webpack optimizations for better tree shaking
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true
      config.optimization.sideEffects = false

      // Split chunks more aggressively
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
          },
          // Separate large libraries
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: "recharts",
            chunks: "all",
            priority: 20,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "framer-motion",
            chunks: "all",
            priority: 20,
          },
        },
      }
    }
    return config
  },

  // Ensure raw body is preserved for webhooks
  async rewrites() {
    return []
  },

  // Redirects configuration to prevent redirect loops
  async redirects() {
    return [
      // Handle legacy URLs that might cause redirects
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ]
  },

  // Headers for performance, caching, and CORS
  async headers() {
    return [
      // CSS MIME type headers (CRITICAL FIX for Next.js 15)
      {
        source: "/(.*)\\.css",
        headers: [
          {
            key: "Content-Type",
            value: "text/css; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Global CSS files
      {
        source: "/globals.css",
        headers: [
          {
            key: "Content-Type",
            value: "text/css; charset=utf-8",
          },
        ],
      },
      // Sitemap cache headers
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=600, stale-while-revalidate=300",
          },
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
        ],
      },
      // CORS headers for all API routes (fixes React Native issues)
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
      // Stripe webhook specific headers
      {
        source: "/api/stripe/webhook",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      // Global security headers
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ],
      },
      // Asset caching headers
      {
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

module.exports = withBundleAnalyzer(nextConfig)
