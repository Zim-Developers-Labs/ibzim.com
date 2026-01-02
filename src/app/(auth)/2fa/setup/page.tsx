import { getCurrentSession } from '@/lib/server/session';
import { encodeBase32 } from '@oslojs/encoding';
import { createTOTPKeyURI } from '@oslojs/otp';
import { redirect } from 'next/navigation';
import { renderSVG } from 'uqr';
import { globalGETRateLimit } from '@/lib/server/request';
import TwoFAComponents from './components';

export default async function FASetupPage({
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
  if (user.registered2FA && !session.twoFactorVerified) {
    return redirect('/2fa');
  }

  const totpKey = new Uint8Array(20);
  crypto.getRandomValues(totpKey);
  const encodedTOTPKey = encodeBase32(totpKey);
  const keyURI = createTOTPKeyURI('IBZIM', user.username, totpKey, 30, 6);
  const qrcode = renderSVG(keyURI);
  return (
    <>
      <TwoFAComponents
        callbackUrl={callbackUrl}
        encodedTOTPKey={encodedTOTPKey}
        qrcode={qrcode}
      />
    </>
  );
}
