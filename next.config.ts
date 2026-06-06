import type { NextConfig } from 'next';
import { getApiOrigin } from './src/utils/getProductImageUrl';

function buildImageRemotePatterns() {
  const origin = getApiOrigin() || 'http://localhost:3003';

  try {
    const url = new URL(origin);
    return [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: '/**',
      },
    ];
  } catch {
    return [
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '3003',
        pathname: '/**',
      },
    ];
  }
}

const apiOrigin = getApiOrigin() || 'http://localhost:3003';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
  async rewrites() {
    return [
      {
        source: '/api-media/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
