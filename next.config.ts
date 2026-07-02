import type { NextConfig } from "next";
import path from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === "production" ? "/urcna_map" : "");

const nextConfig: NextConfig = {
  basePath,
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
