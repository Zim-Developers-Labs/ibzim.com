import { validateRequest } from '@/lib/auth/validate-request';
import DistanceCalculatorWrapper from './wrapper';
import { getAllToolAnswers } from '../actions';
import { Metadata } from 'next';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Distance Calculator | IBZim`,
    description: `Get the distance between Zimbabwean places, how long it takes to travel, and the cost of fuel.`,
    pageUrl: '/tools/distance-calculator',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });

export default async function DistanceCalculatorPage() {
  const { user } = await validateRequest();
  const dbAnswers = await getAllToolAnswers('distance-calculator');

  return <DistanceCalculatorWrapper user={user} dbAnswers={dbAnswers} />;
}
