import { validatePasswordResetSessionRequest } from '@/lib/server/password-reset';
import { globalGETRateLimit } from '@/lib/server/request';
import { redirect } from 'next/navigation';
import ResetPasswordComponents from './components';

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
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect('/reset-password/2fa');
  }
  return <ResetPasswordComponents />;
}
