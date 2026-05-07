import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@/src/atoms",
      "@/src/molecules",
      "@/src/organisms",
      "@/src/mocks",
    ],
  },
};

export default nextConfig;
