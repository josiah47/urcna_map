import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === "production" ? "/urcna_map" : "");

const nextConfig: NextConfig = {
  basePath,
};

export default nextConfig;
