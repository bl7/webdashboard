/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["stripe"],
  // Ensure raw body is preserved for webhooks
  async rewrites() {
    return []
  },
  // Disable body parsing for webhook routes
  async headers() {
    return [
      {
        source: "/api/stripe/webhook",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
