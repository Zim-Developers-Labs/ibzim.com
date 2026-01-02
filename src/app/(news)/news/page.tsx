import { Metadata } from 'next';
import NewsListingComponents from './_components';
import { preparePageMetadata } from '@/lib/metadata';
import { getAllNewsArticles } from '@/lib/sanity/client';

export async function generateMetadata(): Promise<Metadata> {
  return preparePageMetadata({
    title: 'Zimbabwe News, Politics, Sports & Latest Headlines - IBZim',
    description:
      'Discover the latest breaking news in Zimbabwe - politics, weather, entertainment, lifestyle, finance, sports and much more.',
    pageUrl: '/news',
    imageUrl: '/news-banner.webp',
  });
}

export default async function NewsListingPage() {
  const articles = await getAllNewsArticles();

  return <NewsListingComponents articles={articles} />;
}
