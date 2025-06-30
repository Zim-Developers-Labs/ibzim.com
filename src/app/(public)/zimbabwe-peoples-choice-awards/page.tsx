import { Metadata } from 'next';
import AwardsPageWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `People's Choice Awards | IBZim`,
    description: `Celebrate the best of Zimbabwean talent and culture at the People's Choice Awards. Nominate your favorites and vote for the winners.`,
    pageUrl: '/zimbabwe-peoples-choice-awards',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });

export default function AwardsPage() {
  return <AwardsPageWrapper />;
}
