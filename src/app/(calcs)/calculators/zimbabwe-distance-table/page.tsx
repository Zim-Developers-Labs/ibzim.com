import { Metadata } from 'next';
import DistanceTableComponents from './_components';
import { preparePageMetadata } from '@/lib/metadata';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Zimbabwe Distance Table | Download`,
    description: `View distance between Zimbabwe locations and estimate travel costs including fuel and tolls.`,
    pageUrl: '/calculators/zimbabwe-distance-table',
    imageUrl: '/assets/calc-logos/zinara-banner.png',
  });

export default function DistanceTablePage() {
  return <DistanceTableComponents />;
}
