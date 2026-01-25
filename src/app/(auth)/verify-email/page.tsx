import VerifyEmailComponents from './components';

import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { getUserEmailVerificationRequestFromRequest } from '@/lib/server/email-verification';
import { globalGETRateLimit } from '@/lib/server/request';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; requestId?: string }>;
}) {
  const { callbackUrl, requestId } = await searchParams;

  if (!(await globalGETRateLimit())) {
    return 'Too many requests';
  }
  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect('/sign-in');
  }

  // TODO: Ideally we'd sent a new verification email automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest =
    await getUserEmailVerificationRequestFromRequest();
  if (verificationRequest === null && user.emailVerified) {
    return redirect(callbackUrl ? callbackUrl : `/continue`);
  }

  return (
    <VerifyEmailComponents
      user={user}
      verificationRequest={verificationRequest}
      callbackUrl={callbackUrl}
    />
  );
}
