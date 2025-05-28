import { Metadata } from 'next';
import ZesaCalculatorPageWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `ZESA Calculator`,
    description: `Calculate your electricity bills and tariffs.`,
    pageUrl: '/tools/zesa-calculator',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });

export default function ZesaCalculatorPage() {
  return <ZesaCalculatorPageWrapper />;
}
