import type { NextConfig } from 'next';

const getConfig = () => {
  // TODO: importing the env.js synchronously here is an experiment its safe to remove if causing errors
  import('./src/env.js');

  return {
    // typescript: {
    //   ignoreBuildErrors: true,
    // },
    // eslint: {
    //   ignoreDuringBuilds: true,
    // },
    images: {
      remotePatterns: [
        { hostname: 'cdn.sanity.io' },
        { hostname: 'lh3.googleusercontent.com' },
        { hostname: 'avatars.githubusercontent.com' },
        { hostname: 'ewxtfugdovg4wwyt.public.blob.vercel-storage.com' },
      ],
    },

    async redirects() {
      return [
        {
          source: '/people/rankings/richest-zimbabwean-men-and-women',
          destination: '/people/rankings/richest-people-in-zimbabwe',
          permanent: true,
        },
        {
          source:
            '/education/info/2025-school-opening-and-closing-dates-calender-in-zimbabwe',
          destination: '/education/info/zimbabwe-school-calendar-2025',
          permanent: true,
        },
        {
          source:
            '/telecom/guides/how-to-get-econet-or-netone-business-shortcode',
          destination:
            '/telecom/guides/how-to-register-econet-or-netone-business-shortcode',
          permanent: true,
        },
        {
          source:
            '/education/rankings/100-best-high-passrate-a-level-schools-for-2023',
          destination:
            '/education/rankings/top-100-best-a-level-schools-in-zimbabwe',
          permanent: true,
        },
        {
          source: '/media/rankings/most-followed-zimbabweans-on-instagram',
          destination:
            '/media/rankings/top-30-most-followed-zimbabweans-on-instagram',
          permanent: true,
        },
        {
          source: '/wiki/:path*',
          destination: '/profiles/:path*',
          permanent: true,
        },
        {
          source:
            '/education/rankings/highest-passrate-o-level-schools-for-2023-zimsec',
          destination:
            '/education/rankings/top-100-best-o-level-schools-in-zimbabwe',
          permanent: true,
        },
        {
          source:
            '/education/rankings/grade-7-zimsec-2023-best-performing-schools',
          destination:
            '/education/rankings/top-100-best-primary-schools-in-zimbabwe',
          permanent: true,
        },
        {
          source: '/media/rankings/most-followed-zimbabweans-on-social-media',
          destination:
            '/media/rankings/top-30-most-followed-zimbabweans-on-instagram',
          permanent: true,
        },
        {
          source: '/tools/distance-calculator',
          destination: '/tools/travel-planner',
          permanent: true,
        },
        {
          source: '/tools/calendar',
          destination: '/tools/events-calendar',
          permanent: true,
        },
      ];
    },
  } as NextConfig;
};

export default getConfig();
