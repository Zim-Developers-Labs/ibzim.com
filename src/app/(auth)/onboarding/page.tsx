import About from './about';
import { validateRequest } from '@/lib/auth/validate-request';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';
import { Metadata } from 'next';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';
import { Icons } from '@/components/icons';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Finish Creating Account | IBZim',
    description: 'Complete your IBZim profile.',
    pageUrl: '/onboarding',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function OnBoarding({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { user } = await validateRequest();

  const { callbackUrl } = await searchParams;

  if (!user) redirect(Paths.Login);
  if (user.profileCompleted) redirect(callbackUrl || Paths.Home);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto mt-12 mb-8 w-fit">
          <Icons.logo />
        </div>
        <h2 className="mb-8 text-center text-2xl font-light text-gray-900 sm:text-3xl">
          Tell us a bit about yourself
        </h2>
      </div>
      <About user={user} callbackUrl={callbackUrl} />
    </div>
  );
}
