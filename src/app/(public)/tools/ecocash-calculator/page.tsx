import { preparePageMetadata } from '@/lib/metadata';
import EcoCashCalculatorPageWrapper from './wrapper';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { validateRequest } from '@/lib/auth/validate-request';
import { getAllToolAnswers } from '../actions';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Ecocash Calculator | IBZim`,
    description: `Calculate your Ecocash transactions, fees, and balances with the easy-to-use Ecocash Calculator tool.`,
    pageUrl: '/tools/ecocash-calculator',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });

export default async function EcoCashCalculatorPage() {
  const { user } = await validateRequest();
  const dbAnswers = await getAllToolAnswers('ecocash-calculator');
  return <EcoCashCalculatorPageWrapper user={user} dbAnswers={dbAnswers} />;
}
