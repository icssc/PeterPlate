import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uci.campusdish.com"
      },
      {
        protocol: "https",
        hostname: "images.elevate-dxp.com"
      }
    ],
  },
};

export default nextConfig;

