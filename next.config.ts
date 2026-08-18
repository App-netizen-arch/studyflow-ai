import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { typedRoutes: true },
  poweredByHeader: false,
};

export default nextConfig;
