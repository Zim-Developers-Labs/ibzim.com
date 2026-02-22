import { Metadata } from 'next';
import HomeComponent from './component';
import { preparePageMetadata } from '@/lib/metadata';
import { getStarsCount } from './actions';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'IBZIM: Search Engine & Information Hub',
    description:
      'IBZIM is a search engine and information platform for knowledge about Zimbabwe through various tools such as tables, articles and more.',
    pageUrl: '/',
    imageUrl: '/banner.webp',
  });

export default async function HomePage() {
  const starsCount = await getStarsCount();

  return <HomeComponent starsCount={starsCount} />;
}
