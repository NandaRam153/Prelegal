import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16.
  // @react-pdf/renderer v4 does not require canvas polyfills under Turbopack.
  turbopack: {},
};

export default nextConfig;
