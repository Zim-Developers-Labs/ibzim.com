import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { getAllPressArticles } from '@/sanity/lib/client';
import { CardPressArticleType } from '@/types';
import { Metadata } from 'next';
import PressReleasesWrapper from './wrapper';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Press | IBZim',
    description: 'IBZim news, updates and announcements.',
    pageUrl: '/press',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function PressReleasesPage() {
  const [articles]: [CardPressArticleType[]] = await Promise.all([
    getAllPressArticles(),
  ]);

  return <PressReleasesWrapper articles={articles} />;
}
