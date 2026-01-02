import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { getUserPhoneNumberVerificationRequestFromRequest } from '@/lib/server/phone-number-verification';
import { globalGETRateLimit } from '@/lib/server/request';
import VerifyPhoneNumberComponents from './components';

export default async function VerifyPhoneNumberPage({
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

  // TODO: Ideally we'd sent a new verification text automatically if the previous one is expired,
  // but we can't set cookies inside server components.
  const verificationRequest =
    await getUserPhoneNumberVerificationRequestFromRequest();
  if (verificationRequest === null && user.phoneNumberVerified) {
    return redirect(callbackUrl ? callbackUrl : `/continue`);
  }

  if (verificationRequest === null) {
    return redirect(
      `/change-phone-number${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`,
    );
  }

  return (
    <VerifyPhoneNumberComponents
      user={user}
      verificationRequest={verificationRequest}
      callbackUrl={callbackUrl}
    />
  );
}
