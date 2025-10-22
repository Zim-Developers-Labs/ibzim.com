'use client';

import { useState } from 'react';
import PremiumBenefits from './benefits';
import PremiumHero from './hero';
import PremiumPricing from './pricing';

export type TierType = {
  name: string;
  id: string;
  frequency: string;
  featured: boolean;
  price: {
    personal: number;
    business: number | undefined;
  };
};

export const tiers = [
  {
    name: 'Weekly',
    id: 'tier-weekly',
    frequency: 'weekly',
    featured: false,
    price: {
      personal: 0.99,
      business: undefined,
    },
  },
  {
    name: 'Monthly',
    id: 'tier-monthly',
    frequency: 'monthly',
    featured: true,
    price: {
      personal: 2.99,
      business: 9.99,
    },
  },
  {
    name: 'Yearly',
    id: 'tier-yearly',
    frequency: 'yearly',
    featured: false,
    price: {
      personal: 24.99,
      business: 99.99,
    },
  },
] satisfies TierType[];

export default function PremiumComponents() {
  const [subType, setSubType] = useState('personal');

  return (
    <>
      <PremiumHero subType={subType} setSubType={setSubType} />
      <PremiumPricing tiers={tiers} subType={subType} />
      <PremiumBenefits subType={subType} />
    </>
  );
}
