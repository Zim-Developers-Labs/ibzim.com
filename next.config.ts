import type { NextConfig } from 'next';
import { withBotId } from 'botid/next/config';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@node-rs/argon2'],

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
      {
        source: '/education/rankings/top-100-best-primary-schools-in-zimbabwe',
        destination: '/tools/school-picker/best-primary-schools-in-zimbabwe',
        permanent: true,
      },
      {
        source: '/education/rankings/top-100-best-o-level-schools-in-zimbabwe',
        destination: '/tools/school-picker/best-o-level-schools-in-zimbabwe',
        permanent: true,
      },
      {
        source: '/education/rankings/top-100-best-a-level-schools-in-zimbabwe',
        destination: '/tools/school-picker/best-a-level-schools-in-zimbabwe',
        permanent: true,
      },
      {
        source: '/education/rankings/top-20-best-universities-in-zimbabwe',
        destination:
          '/tools/school-picker/best-tertiary-institutions-in-zimbabwe',
        permanent: true,
      },
      {
        source: '/education/info/zimbabwe-school-calendar-2025',
        destination:
          '/education/info/school-calendar-zimbabwe-opening-and-closing-dates',
        permanent: true,
      },
    ];
  },
};

export default withBotId(nextConfig);
