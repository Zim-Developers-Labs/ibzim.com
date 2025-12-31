import { Metadata } from 'next';
import AwardsPageComponent from './components';
import { preparePageMetadata } from '@/lib/metadata';
import { getAllAwardCategories } from '@/lib/sanity/client';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `People's Choice Awards | IBZim`,
    description: `Celebrate the best of Zimbabwean talent and culture at the People's Choice Awards. Nominate your favorites and vote for the winners.`,
    pageUrl: '/zimbabwe-peoples-choice-awards',
    imageUrl: '/banner.webp',
  });

export default async function AwardsPage() {
  const sanityAwardCategories = await getAllAwardCategories();

  return <AwardsPageComponent sanityAwardCategories={sanityAwardCategories} />;
}
