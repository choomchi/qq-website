import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath: '/mysecretpreview',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qoqnoos.ir",
      },
    ],
  },
};

export default nextConfig;
