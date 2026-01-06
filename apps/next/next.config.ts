import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // ! TODO: Fix these errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uci.campusdish.com",
      },
      {
        protocol: "https",
        hostname: "images.elevate-dxp.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@api": path.resolve(__dirname, "../../packages/api/src"),
    };
    return config;
  },
};

export default nextConfig;

