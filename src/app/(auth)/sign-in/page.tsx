import { SignInComponents } from './components';

import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { globalGETRateLimit } from '@/lib/server/request';
import { Metadata } from 'next';
import { Paths } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Login | IBZIM Account',
  description: 'Login to access your IBZim account.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  if (!(await globalGETRateLimit())) {
    return 'Too many requests';
  }

  const { session, user } = await getCurrentSession();

  if (session !== null) {
    if (!user.emailVerified) {
      return redirect(Paths.VerifyEmail);
    }
    if (!user.registered2FA) {
      return redirect('/2fa/setup');
    }
    if (!session.twoFactorVerified) {
      return redirect('/2fa');
    }
    return redirect(callbackUrl || Paths.Home);
  }
  return <SignInComponents callbackUrl={callbackUrl} error={error} />;
}
