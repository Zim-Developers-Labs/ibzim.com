import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import PoliciesWrapper from './wrapper';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Policies | IBZim',
    description: 'Our Policies.',
    pageUrl: '/policies',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function PoliciesPage() {
  return <PoliciesWrapper />;
}
