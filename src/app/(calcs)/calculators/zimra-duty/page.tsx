import { Metadata } from 'next';
import ZimraDutyCalculatorComponents from './_components';
import { preparePageMetadata } from '@/lib/metadata';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `ZIMRA Duty Calculator`,
    description: `Calculate ZIMRA duty fees and taxes for imported goods based on Zimbabwe regulations.`,
    pageUrl: '/calculators/zimra-duty',
    imageUrl: '/assets/calc-logos/zimra-banner.png',
  });

export default function ZimraDutyCalculatorPage() {
  return <ZimraDutyCalculatorComponents />;
}
