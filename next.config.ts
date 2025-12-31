import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'ewxtfugdovg4wwyt.public.blob.vercel-storage.com' },
    ],
  },

  async redirects() {
    return [
      {
        source: '/tools/travel-planner',
        destination: '/calculators/zimbabwe-distance-table',
        permanent: true,
      },
      {
        source: '/tools/ecocash-calculator',
        destination: '/calculators/ecocash-charges',
        permanent: true,
      },
      {
        source: '/tools/currency-converter/usd-zig',
        destination: '/calculators/currency-converter',
        permanent: true,
      },
      {
        source: '/tools/zesa-electricity-calculator',
        destination: '/calculators/zesa-units',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
