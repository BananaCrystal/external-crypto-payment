import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // Remove all console logs in both development and production
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;
