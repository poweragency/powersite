import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // semplifica il deploy in repo cliente
  },
};

export default nextConfig;
