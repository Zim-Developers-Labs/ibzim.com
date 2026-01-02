import ResetPassword2FAComponents from './components';

import { validatePasswordResetSessionRequest } from '@/lib/server/password-reset';
import { globalGETRateLimit } from '@/lib/server/request';
import { redirect } from 'next/navigation';

export default async function Page() {
  if (!globalGETRateLimit()) {
    return 'Too many requests';
  }
  const { session, user } = await validatePasswordResetSessionRequest();

  if (session === null) {
    return redirect('/forgot-password');
  }
  if (!session.emailVerified) {
    return redirect('/reset-password/verify-email');
  }
  if (!user.registered2FA) {
    return redirect('/reset-password');
  }
  if (session.twoFactorVerified) {
    return redirect('/reset-password');
  }
  return <ResetPassword2FAComponents />;
}
