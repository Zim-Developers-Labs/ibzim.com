import { Metadata } from 'next';
import CurrencyConverterComponents from './_components';
import { preparePageMetadata } from '@/lib/metadata';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Zimbabwe Currency Converter | ZiG, USD, ZWL, ZAR`,
    description: `Convert currencies including ZiG, USD, ZWL, and ZAR with up-to-date official and unofficial exchange rates.`,
    pageUrl: '/calculators/currency-converter',
    imageUrl: '/assets/calc-logos/zig-banner.png',
  });

export default function CurrencyConverterPage() {
  return <CurrencyConverterComponents />;
}
