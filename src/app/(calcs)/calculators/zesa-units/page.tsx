import { Metadata } from 'next';
import ZesaUnitsComponents from './_components';
import { preparePageMetadata } from '@/lib/metadata';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `ZESA Units and Cost Calculator`,
    description: `Calculate ZESA electricity consumption in units and cost for residential and commercial users in Zimbabwe.`,
    pageUrl: '/calculators/zesa-units',
    imageUrl: '/assets/calc-logos/zesa-banner.png',
  });

export default function ZesaUnitsPage() {
  return <ZesaUnitsComponents />;
}
