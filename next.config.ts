import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    serverActions: { bodySizeLimit: "3mb" }, // imágenes de hasta 2 MB
  },
  // En desarrollo, permite abrir la app por la IP de la red local (cambia si cambia el Wi-Fi).
  allowedDevOrigins: ["10.21.38.169"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
