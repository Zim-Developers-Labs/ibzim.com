'use server';

import { resetUser2FAWithRecoveryCode } from '@/lib/server/2fa';
import { recoveryCodeBucket } from '@/lib/server/constants';
import { getCurrentSession } from '@/lib/server/session';

import { redirect } from 'next/navigation';

export async function reset2FAAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: 'Not authenticated',
    };
  }
  if (!user.emailVerified || !user.registered2FA || session.twoFactorVerified) {
    return {
      message: 'Forbidden',
    };
  }
  if (!recoveryCodeBucket.check(user.id, 1)) {
    return {
      message: 'Too many requests',
    };
  }

  const code = formData.get('code');

  if (typeof code !== 'string') {
    return {
      message: 'Invalid or missing fields',
    };
  }
  if (code === '') {
    return {
      message: 'Please enter your code',
    };
  }
  if (!recoveryCodeBucket.consume(user.id, 1)) {
    return {
      message: 'Too many requests',
    };
  }

  const valid = await resetUser2FAWithRecoveryCode(user.id, code);

  if (!valid) {
    return {
      message: 'Invalid recovery code',
    };
  }
  recoveryCodeBucket.reset(user.id);

  const callbackUrl = String(formData.get('callbackUrl'));

  return redirect(
    callbackUrl === '' ? '/2fa/setup' : `/2fa/setup?callbackUrl=${callbackUrl}`,
  );
}

interface ActionResult {
  message: string;
}
