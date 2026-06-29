import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@peterplate/api",
    "@peterplate/db",
    "@peterplate/validators",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "uci.campusdish.com" },
      { protocol: "https", hostname: "images.elevate-dxp.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      { protocol: "https", hostname: "delivery-p140432-e1469601.adobeaemcloud.com" },
    ],
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        destination: '/apple-app-site-association',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  /* webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@api": path.resolve(__dirname, "../../packages/api/src"),
    };
    return config;
  }, */
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Prevent Workbox from intercepting the PostHog reverse-proxy route.
  // Without this, the SW intercepts /app-data/* requests and fails because
  // the proxied PostHog responses are not cacheable in the expected way.
  buildExcludes: [/app-data/],
  // Never let the service worker serve cached auth responses (from main).
  runtimeCaching: [
    {
      urlPattern: /\/api\/auth\//,
      handler: "NetworkOnly",
      method: "GET",
    },
  ],
})(nextConfig);
