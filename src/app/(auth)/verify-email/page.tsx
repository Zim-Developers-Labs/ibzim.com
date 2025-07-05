import { validateRequest } from '@/lib/auth/validate-request';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';
import VerifyCode from './verify-code';
import { Metadata } from 'next';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: 'Verify Email',
    description: 'Enter the code sent to your email address.',
    pageUrl: '/verify-email',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { user } = await validateRequest();

  const { callbackUrl } = await searchParams;

  if (!user) redirect(Paths.Login);
  if (user.emailVerified) redirect(callbackUrl || Paths.Home);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-20 mb-8 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Verify your email
          </h2>
          <p>
            Verification code was sent to <strong>{user.email}</strong>. Check
            your spam folder if you can&#39;t find the email.
          </p>
        </div>

        <VerifyCode callbackUrl={callbackUrl} />
      </div>
    </>
  );
}
