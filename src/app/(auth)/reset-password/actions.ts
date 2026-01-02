'use server';

import { verifyPasswordStrength } from '@/lib/server/password';
import {
  deletePasswordResetSessionTokenCookie,
  invalidateUserPasswordResetSessions,
  validatePasswordResetSessionRequest,
} from '@/lib/server/password-reset';
import {
  createSession,
  invalidateUserSessions,
  setSessionTokenCookie,
} from '@/lib/server/session';
import { updateUserPassword } from '@/lib/server/user';
import { redirect } from 'next/navigation';
import { globalPOSTRateLimit } from '@/lib/server/request';
import { generateSessionToken, SessionFlags } from '@/lib/server/constants';

export async function resetPasswordAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!globalPOSTRateLimit()) {
    return {
      message: 'Too many requests',
    };
  }
  const { session: passwordResetSession, user } =
    await validatePasswordResetSessionRequest();
  if (passwordResetSession === null) {
    return {
      message: 'Not authenticated, Session expired',
    };
  }
  if (!passwordResetSession.emailVerified) {
    return {
      message: 'Forbidden',
    };
  }
  if (user.registered2FA && !passwordResetSession.twoFactorVerified) {
    return {
      message: 'Forbidden',
    };
  }

  const password = formData.get('password');
  if (typeof password !== 'string') {
    return {
      message: 'Invalid or missing fields',
    };
  }

  const strongPassword = await verifyPasswordStrength(password);
  if (!strongPassword) {
    return {
      message: 'Weak password',
    };
  }
  await invalidateUserPasswordResetSessions(passwordResetSession.userId);
  await invalidateUserSessions(passwordResetSession.userId);
  await updateUserPassword(passwordResetSession.userId, password);

  const sessionFlags: SessionFlags = {
    twoFactorVerified: passwordResetSession.twoFactorVerified,
  };
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id, sessionFlags);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  await deletePasswordResetSessionTokenCookie();
  return redirect('/');
}

interface ActionResult {
  message: string;
}
