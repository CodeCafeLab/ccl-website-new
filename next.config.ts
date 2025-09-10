import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {},
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy to Backend
      },
      {
        source: '/api/:path*',
        destination: 'http://admin.codecafelab.in/api/:path*', // Proxy to Backend
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // Added for YouTube thumbnails
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Added for Firebase Storage images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com', // Added for placeholder images
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;