'use server';

import { sendVerificationTextBucket } from '@/lib/server/constants';
import { invalidateUserPasswordResetSessions } from '@/lib/server/password-reset';
import {
  createPhoneNumberVerificationRequest,
  deletePhoneNumberVerificationRequestCookie,
  deleteUserPhoneNumberVerificationRequest,
  getUserPhoneNumberVerificationRequestFromRequest,
  sendVerificationText,
  setPhoneNumberVerificationRequestCookie,
} from '@/lib/server/phone-number-verification';
import { ExpiringTokenBucket } from '@/lib/server/rate-limit';
import { globalPOSTRateLimit } from '@/lib/server/request';
import { getCurrentSession } from '@/lib/server/session';
import { updateUserPhoneNumberAndSetPhoneNumberAsVerified } from '@/lib/server/user';
import { redirect } from 'next/navigation';

const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export async function verifyNumberAction(
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
      message: 'Not authenticated',
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

  let verificationRequest =
    await getUserPhoneNumberVerificationRequestFromRequest();
  if (verificationRequest === null) {
    return {
      message: 'Not authenticated',
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
    verificationRequest = await createPhoneNumberVerificationRequest(
      verificationRequest.userId,
      verificationRequest.phoneNumber,
    );
    await sendVerificationText(
      verificationRequest.phoneNumber,
      verificationRequest.code,
    );
    return {
      message:
        'The verification code was expired. We sent another code to your whatsapp inbox.',
    };
  }
  if (verificationRequest.code !== code) {
    return {
      message: 'Incorrect code.',
    };
  }
  await deleteUserPhoneNumberVerificationRequest(user.id);
  await invalidateUserPasswordResetSessions(user.id);
  await updateUserPhoneNumberAndSetPhoneNumberAsVerified(
    user.id,
    verificationRequest.phoneNumber,
  );
  await deletePhoneNumberVerificationRequestCookie();

  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  if (!user.registered2FA) {
    return redirect(`/2fa/setup`);
  }
  return redirect('/continue');
}

export async function resendPhoneNumberVerificationCodeAction(): Promise<ActionResult> {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      message: 'Not authenticated',
    };
  }
  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      message: 'Forbidden',
    };
  }
  if (!sendVerificationTextBucket.check(user.id, 1)) {
    return {
      message: 'Too many requests',
    };
  }
  let verificationRequest =
    await getUserPhoneNumberVerificationRequestFromRequest();
  if (verificationRequest === null) {
    if (user.phoneNumberVerified) {
      return {
        message: 'Forbidden: number already verified',
      };
    }
    if (!sendVerificationTextBucket.consume(user.id, 1)) {
      return {
        message: 'Too many requests',
      };
    }

    verificationRequest = await createPhoneNumberVerificationRequest(
      user.id,
      user.email,
    );
  } else {
    if (!sendVerificationTextBucket.consume(user.id, 1)) {
      return {
        message: 'Too many requests',
      };
    }
    verificationRequest = await createPhoneNumberVerificationRequest(
      user.id,
      verificationRequest.phoneNumber,
    );
  }

  await sendVerificationText(
    verificationRequest.phoneNumber,
    verificationRequest.code,
  );
  await setPhoneNumberVerificationRequestCookie(verificationRequest);

  return {
    message: 'A new code was sent to your inbox.',
  };
}

interface ActionResult {
  message: string;
}
