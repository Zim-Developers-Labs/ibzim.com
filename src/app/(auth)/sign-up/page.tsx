import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { globalGETRateLimit } from '@/lib/server/request';
import SignUpComponents from './components';
import { Paths } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create IBZIM Account',
  description: 'Create your IBZim account to get started.',
};

export default async function Page({
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
  return <SignUpComponents callbackUrl={callbackUrl} error={error} />;
}
