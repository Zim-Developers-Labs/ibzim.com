'use server';

import { sendVerificationEmailBucket } from '@/lib/server/constants';
import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getUserEmailVerificationRequestFromRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from '@/lib/server/email-verification';
import { invalidateUserPasswordResetSessions } from '@/lib/server/password-reset';
import { ExpiringTokenBucket } from '@/lib/server/rate-limit';
import { globalPOSTRateLimit } from '@/lib/server/request';
import { getCurrentSession } from '@/lib/server/session';
import { updateUserEmailAndSetEmailAsVerified } from '@/lib/server/user';
import { redirect } from 'next/navigation';

const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export async function verifyEmailAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!globalPOSTRateLimit()) {
    return {
      message: 'Too many requests',
    };
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: 'Not authenticated: no session found',
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: 'Forbidden',
    };
  }
  if (!bucket.check(user.id, 1)) {
    return {
      message: 'Too many requests',
    };
  }

  let verificationRequest = await getUserEmailVerificationRequestFromRequest();
  if (verificationRequest === null) {
    return {
      message: 'Not authenticated: no verification request found',
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
      message: 'Enter your code',
    };
  }
  if (!bucket.consume(user.id, 1)) {
    return {
      message: 'Too many requests',
    };
  }
  if (Date.now() >= verificationRequest.expiresAt.getTime()) {
    verificationRequest = await createEmailVerificationRequest(
      verificationRequest.userId,
      verificationRequest.email,
    );
    await sendVerificationEmail(
      verificationRequest.email,
      verificationRequest.code,
    );
    return {
      message:
        'The verification code was expired. We sent another code to your inbox.',
    };
  }
  if (verificationRequest.code !== code) {
    return {
      message: 'Incorrect code.',
    };
  }
  await deleteUserEmailVerificationRequest(user.id);
  await invalidateUserPasswordResetSessions(user.id);
  await updateUserEmailAndSetEmailAsVerified(
    user.id,
    verificationRequest.email,
  );
  await deleteEmailVerificationRequestCookie();

  const callbackUrl = String(formData.get('callbackUrl'));

  if (!user.registered2FA) {
    return redirect(
      callbackUrl === ''
        ? '/2fa/setup'
        : `/2fa/setup?callbackUrl=${callbackUrl}`,
    );
  }
  return redirect(callbackUrl !== '' ? callbackUrl : `/`);
}

export async function resendEmailVerificationCodeAction(): Promise<ActionResult> {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: 'Not authenticated: no session found',
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: 'Forbidden',
    };
  }
  if (!sendVerificationEmailBucket.check(user.id, 1)) {
    return {
      message: 'Too many requests',
    };
  }
  let verificationRequest = await getUserEmailVerificationRequestFromRequest();
  if (verificationRequest === null) {
    if (user.emailVerified) {
      return {
        message: 'Forbidden: email already verified',
      };
    }
    if (!sendVerificationEmailBucket.consume(user.id, 1)) {
      return {
        message: 'Too many requests',
      };
    }
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email,
    );
  } else {
    if (!sendVerificationEmailBucket.consume(user.id, 1)) {
      return {
        message: 'Too many requests',
      };
    }
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      verificationRequest.email,
    );
  }

  await sendVerificationEmail(
    verificationRequest.email,
    verificationRequest.code,
  );
  await setEmailVerificationRequestCookie(verificationRequest);

  return {
    message: 'A new code was sent to your inbox.',
  };
}

interface ActionResult {
  message: string;
}

export async function sendVerificationRequestAction(): Promise<void> {
  const { user } = await getCurrentSession();

  if (user === null) {
    redirect('/sign-in');
  }

  const emailVerificationRequest = await createEmailVerificationRequest(
    user.id,
    user.email,
  );

  await sendVerificationEmail(
    emailVerificationRequest.email,
    emailVerificationRequest.code,
  );
  await setEmailVerificationRequestCookie(emailVerificationRequest);
}
