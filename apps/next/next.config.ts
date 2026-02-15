import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // ! TODO: Fix these errors
  typescript: {
    ignoreBuildErrors: true,
  },
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
  /* webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@api": path.resolve(__dirname, "../../packages/api/src"),
    };
    return config;
  }, */
};

export default nextConfig;

