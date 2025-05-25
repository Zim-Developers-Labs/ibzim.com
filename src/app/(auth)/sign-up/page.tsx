import { validateRequest } from '@/lib/auth/validate-request';
import { Paths } from '@/lib/constants';
import SignUpLayout from './signup';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Create Account | IBZim',
    description: 'Signup IBZim new account.',
    pageUrl: '/sign-up',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { user } = await validateRequest();
  const { callbackUrl } = await searchParams;

  if (user) redirect(callbackUrl || Paths.Home);

  return <SignUpLayout callbackUrl={callbackUrl} />;
}
