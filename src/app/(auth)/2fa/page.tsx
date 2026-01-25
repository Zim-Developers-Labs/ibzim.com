import TwoFactorVerificationComponents from './components';
import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { globalGETRateLimit } from '@/lib/server/request';

export default async function FAPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  if (!(await globalGETRateLimit())) {
    return 'Too many requests';
  }
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect('/sign-in');
  }
  if (!user.emailVerified) {
    return redirect('/verify-email');
  }
  if (!user.registered2FA) {
    return redirect('/2fa/setup');
  }
  if (session.twoFactorVerified) {
    return redirect('/');
  }
  return <TwoFactorVerificationComponents callbackUrl={callbackUrl} />;
}
