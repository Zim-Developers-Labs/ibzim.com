// auth/sign-in/page.tsx

import { validateRequest } from '@/lib/auth/validate-request';
import SignInLayout from './signin';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';
import { Metadata } from 'next';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Login | IBZIM Account',
    description: 'Complete your IBZim profile.',
    pageUrl: '/sign-in',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { user } = await validateRequest();

  const { callbackUrl } = await searchParams;

  if (user) {
    redirect(callbackUrl || Paths.Home);
  }

  return <SignInLayout callbackUrl={callbackUrl} />;
}
