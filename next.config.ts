import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "25mb" },
  },
  // Le route serverless devono poter leggere i template a runtime per copiarli
  // in .generated/{nonce}/. Senza questo Next non li include nel bundle.
  outputFileTracingIncludes: {
    "/api/stripe/webhook": ["./templates/**/*"],
  },
};

export default nextConfig;
