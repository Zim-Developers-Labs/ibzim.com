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
        destination: 'https://tools.zimdevelopers.com/travel-planner',
        permanent: true,
      },
      {
        source: '/tools/ecocash-calculator',
        destination: 'https://tools.zimdevelopers.com/ecocash-calculator',
        permanent: true,
      },
      {
        source: '/tools/currency-converter/usd-zig',
        destination:
          'https://tools.zimdevelopers.com/currency-converter/usd-zig',
        permanent: true,
      },
      {
        source: '/tools/zesa-electricity-calculator',
        destination:
          'https://tools.zimdevelopers.com/zesa-electricity-calculator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
