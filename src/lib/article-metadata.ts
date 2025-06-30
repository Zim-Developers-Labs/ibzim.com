import { Metadata } from 'next';
import { truncateOnWord } from './utils';
import { SiteConfigType } from '@/types';

type ArticleMetadataRecipe = {
  title?: string;
  description?: string;
  pageUrl?: string;
  ogImage?: {
    url: string;
    width: number;
    height: number;
  };
  siteConfig: SiteConfigType;
  author?: {
    name?: string;
    url?: string;
  };
};

export const prepareArticleMetadata = (
  recipe: ArticleMetadataRecipe,
): Metadata => ({
  metadataBase: new URL(recipe.siteConfig.url.web),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon-mask',
        url: '/safari-pinned-tab.png',
        color: '#000000',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  robots: '/robots.txt',
  other: {
    'application-TileColor': '#EAB308',
  },

  authors: recipe.author
    ? [
        { name: recipe.author.name },
        { url: recipe.author.url ? recipe.author.url : '' },
      ]
    : [],

  twitter: {
    site: recipe.siteConfig.twitterUsername,
    creator: recipe.siteConfig.twitterUsername,
    card: 'summary_large_image',
    title: recipe.title,
    description: recipe.description,
    images: {
      url: recipe.ogImage?.url || '',
      height: recipe.ogImage?.height,
      width: recipe.ogImage?.width,
    },
  },
  openGraph: {
    description: truncateOnWord(recipe.description!, 160),
    url: `${recipe.siteConfig.url.web}${recipe.pageUrl}`,
    type: 'website',
    siteName: recipe.siteConfig.name,
    title: recipe.title,
    images: {
      url: recipe.ogImage?.url || '',
      height: recipe.ogImage?.height,
      width: recipe.ogImage?.width,
    },
    locale: 'en_US',
  },
  alternates: {
    canonical: `${recipe.siteConfig.url.web}${recipe.pageUrl}`,
  },
  title: recipe.title,
  description: recipe.description,
});
