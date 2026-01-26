import { Metadata } from 'next';
import HomeComponent from './component';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';
import { getSearchData } from '@/lib/sanity/actions';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'IBZIM: Zimbabwe First Search Engine',
    description:
      'IBZIM is a platform for sharing and discovering information about Zimbabwe through various tools such as tables, biographies, articles and more.',
    pageUrl: '/',
    imageUrl: '/banner.webp',
  });

export default async function HomePage() {
  const { allDocuments } = await getSearchData();

  return <HomeComponent documents={allDocuments} />;
}
