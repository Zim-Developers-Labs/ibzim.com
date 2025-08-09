import { Metadata } from 'next';
import HomeWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';
import { validateRequest } from '@/lib/auth/validate-request';
import { getSearchData } from '@/sanity/lib/actions';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'IBZim: Zimbabwean Information Hub',
    description:
      'An information hub empowering Zimbabweans with raw and authentic knowledge. Signup and complete your profile to join the community.',
    pageUrl: '/',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function HomePage() {
  const { user } = await validateRequest();

  const { allArticles, popularArticles } = await getSearchData(
    siteConfig.popularArticleIds,
    siteConfig.documentPrefix,
  );

  return (
    <HomeWrapper
      articles={allArticles}
      popularArticles={popularArticles}
      user={user}
    />
  );
}
