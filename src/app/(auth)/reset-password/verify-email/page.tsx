import VerifyEmailPasswordResetComponents from './components';

import { validatePasswordResetSessionRequest } from '@/lib/server/password-reset';
import { globalGETRateLimit } from '@/lib/server/request';
import { redirect } from 'next/navigation';

export default async function Page() {
  if (!globalGETRateLimit()) {
    return 'Too many requests';
  }
  const { session } = await validatePasswordResetSessionRequest();
  if (session === null) {
    return redirect('/forgot-password');
  }
  if (session.emailVerified) {
    if (!session.twoFactorVerified) {
      return redirect('/reset-password/2fa');
    }
    return redirect('/reset-password');
  }
  return <VerifyEmailPasswordResetComponents session={session} />;
}
