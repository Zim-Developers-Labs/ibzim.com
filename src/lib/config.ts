import { SiteConfigType } from '@/types';
import { DOMAIN_URLS } from './constants';

export const siteConfig = {
  name: 'IBZim',
  shortName: 'IBZIM',
  twitterUsername: '@IBZimDotCom',
  url: {
    logo: `${DOMAIN_URLS.MAIN()}/apple-touch-icon.png`,
    web: `${DOMAIN_URLS.MAIN()}`,
    twitter: `https://twitter.com/@IBZimDotCom`,
    instagram: `https://www.instagram.com/ibzimdotcom`,
    linkedin: `https://www.linkedin.com/company/XfinityPros`,
    github: `https://github.com/orgs/XfinityPros/repositories`,
    youtube: `https://www.youtube.com/@IBZimDotCom`,
    facebook: `https://www.facebook.com/IBZimDotCom`,
    banner: `${DOMAIN_URLS.MAIN()}/banner.webp`,
  },
  popularArticleIds: [
    '60a33879-89b0-45bb-ac07-0f3e89b06e95',
    '931d73c7-e462-44d3-8834-a9facaa7d2ca',
    '05249379-e874-4185-b387-c55e0adc69df',
    '5ea92479-e6e8-4b72-b165-0f6220ad3ed8',
  ],
} satisfies SiteConfigType;
