import { Metadata } from 'next';
import EcocashCalculatorPageComponents from './components';
import { preparePageMetadata } from '@/lib/metadata';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Ecocash Calculator | IBZim`,
    description: `Calculate your Ecocash transactions, fees, and balances with the easy-to-use Ecocash Calculator tool.`,
    pageUrl: '/calculators/ecocash-charges',
    imageUrl: '/assets/calc-logos/ecocash-banner.png',
  });

export default function EcocashCalculatorPage() {
  return <EcocashCalculatorPageComponents />;
}
