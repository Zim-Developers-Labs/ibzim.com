import { SiteConfigType } from '@/types';

export const deploymentDomain = 'WWW.ibzim.com';

export const siteConfig = {
  name: 'IBZim',
  isNew: false,
  shortName: 'IBZIM',
  vercelProjectName: 'ibzim',
  twitterUsername: '@IBZimDotCom',
  country: 'Zimbabwe',
  documentPrefix: '',
  features: {
    auth: 'disabled',
  },
  url: {
    logo: `https://${deploymentDomain}/apple-touch-icon.png`,
    web: `https://${deploymentDomain}`,
    twitter: `https://twitter.com/@IBZimDotCom`,
    instagram: `https://www.instagram.com/ibzimdotcom`,
    linkedin: `https://www.linkedin.com/company/XfinityPros`,
    github: `https://github.com/orgs/XfinityPros/repositories`,
    youtube: `https://www.youtube.com/@IBZimDotCom`,
    facebook: `https://www.facebook.com/IBZimDotCom`,
    banner: `https://${deploymentDomain}/banner.webp`,
  },
  popularArticleIds: [
    '60a33879-89b0-45bb-ac07-0f3e89b06e95',
    '931d73c7-e462-44d3-8834-a9facaa7d2ca',
    '05249379-e874-4185-b387-c55e0adc69df',
    '5ea92479-e6e8-4b72-b165-0f6220ad3ed8',
  ],
} satisfies SiteConfigType;
