import VerifyEmailComponents from './components';

import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import {
  getUserEmailVerificationRequestFromRequest,
  sendDeleteVerificationEmail,
} from '@/lib/server/email-verification';
import { globalGETRateLimit } from '@/lib/server/request';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

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
  if (verificationRequest === null) {
    return redirect(`/my-account/general`);
  }

  return (
    <VerifyEmailComponents
      user={user}
      verificationRequest={verificationRequest}
      callbackUrl={callbackUrl}
    />
  );
}
