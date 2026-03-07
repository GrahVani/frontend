import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@tanstack/react-query',
      'date-fns',
      'zod',
    ],
  },
};

const config = process.env.ANALYZE === "true"
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default config;
