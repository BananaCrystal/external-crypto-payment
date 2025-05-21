import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Disable image optimization since it requires server components
  images: {
    unoptimized: true,
  },
  // Ensures that any assets referenced in your app use relative paths
  assetPrefix: "",
  // Disables features that won't work with static export
  trailingSlash: true,
  // Ensures correct behavior for client-side routing
  reactStrictMode: true,
};

export default nextConfig;
