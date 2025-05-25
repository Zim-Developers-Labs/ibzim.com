import { SiteConfigType } from '@/types';

export const siteConfig = {
  name: 'IBZim Blog',
  isNew: false,
  shortName: 'IBZIM',
  vercelProjectName: 'ibzim',
  twitterUsername: '@IBZimBlog',
  country: 'Zimbabwe',
  documentPrefix: '',
  url: {
    logo: 'https://www.ibzim.com/apple-touch-icon.png',
    web: 'https://www.ibzim.com',
    twitter: 'https://twitter.com/@IBZimBlog',
    instagram: 'https://www.instagram.com/ibzimblog',
    linkedin: 'https://www.linkedin.com/company/ibzimblog',
    github: 'https://github.com/orgs/XfinityPros/repositories',
    youtube: 'https://www.youtube.com/@IBZimBlog',
    facebook: 'https://www.facebook.com/IBZimBlog1',
    banner: 'https://www.ibzim.com/banner.webp',
  },
  popularArticleIds: [
    '34292b05-7130-43cd-881e-37b86784c65e',
    '6badec74-10d9-4d6a-8c59-bc82bb89a2ba',
    '702e9ef6-cc22-47be-8e57-a39efba744b8',
    '931d73c7-e462-44d3-8834-a9facaa7d2ca',
  ],
} satisfies SiteConfigType;
