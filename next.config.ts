import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'jinnhyunsecurity.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      // Preserve API routes and Next internals — NOT matched here since we
      // match specific paths only. All app routes resolve to legacy-shell.
      { source: '/', destination: '/legacy-shell.html' },
      { source: '/about', destination: '/legacy-shell.html' },
      { source: '/about/:slug*', destination: '/legacy-shell.html' },
      { source: '/solution', destination: '/legacy-shell.html' },
      { source: '/solution/:slug*', destination: '/legacy-shell.html' },
      { source: '/press', destination: '/legacy-shell.html' },
      { source: '/press/:slug*', destination: '/legacy-shell.html' },
      { source: '/contact', destination: '/legacy-shell.html' },
    ];
  },
};

export default nextConfig;
