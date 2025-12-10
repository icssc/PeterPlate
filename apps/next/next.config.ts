import type { NextConfig } from "next";

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
};

export default nextConfig;
