import { Metadata } from 'next';
import PremiumComponents from './components';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';
import { getCurrentSession } from '@/lib/server/session';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Premium IBZIM Subscription Plans',
    description:
      'Explore our premium subscription plans tailored for your needs.',
    pageUrl: '/pricing',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });

export default async function SubscribePremium() {
  const { user } = await getCurrentSession();

  return <PremiumComponents user={user} />;
}
