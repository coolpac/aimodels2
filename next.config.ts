import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  images: {
    qualities: [60, 70, 75],
  },
};

export default nextConfig;
