import { Metadata } from 'next';
import HomeComponent from './component';
import { preparePageMetadata } from '@/lib/metadata';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'IBZIM: Search & information platform for Zimbabwe',
    description:
      'IBZIM is a search engine and information platform for knowledge about Zimbabwe through various tools such as tables, articles and more.',
    pageUrl: '/',
    imageUrl: '/banner.webp',
  });

export default function HomePage() {
  return <HomeComponent />;
}
