import { Metadata } from 'next';
import { preparePageMetadata } from '@/lib/metadata';
import PoliciesPageComponent from './component';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Policies | IBZIM',
    description:
      'Terms and Conditions, Disclaimers, Privacy and Commenting Policies.',
    pageUrl: '/policies',
    imageUrl: '/banner.webp',
  });

export default function HomePage() {
  return <PoliciesPageComponent />;
}
