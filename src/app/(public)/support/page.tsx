import { Metadata } from 'next';
import SupportPageWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Support',
    description: 'Report issues, make suggestions and get help.',
    pageUrl: '/support',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default function SupportPage() {
  return <SupportPageWrapper />;
}
