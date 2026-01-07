'use server';

import { env } from '@/env';
import { sendVerificationEmailBucket } from '@/lib/server/constants';
import { db, sessions, users } from '@/lib/server/db';
import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getUserEmailVerificationRequestFromRequest,
  sendDeleteVerificationEmail,
  setEmailVerificationRequestCookie,
} from '@/lib/server/email-verification';
import { invalidateUserPasswordResetSessions } from '@/lib/server/password-reset';
import { ExpiringTokenBucket } from '@/lib/server/rate-limit';
import { globalPOSTRateLimit } from '@/lib/server/request';
import { getCurrentSession } from '@/lib/server/session';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const bucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export async function verifyDeleteAction(
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

  let verificationRequest = await getUserEmailVerificationRequestFromRequest();
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
    verificationRequest = await createEmailVerificationRequest(
      verificationRequest.userId,
      verificationRequest.email,
    );
    await sendDeleteVerificationEmail(
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

  // Delete the user's account
  await db
    .update(users)
    .set({
      email: `deleted-${user.id}@example.com`,
      emailVerified: false,
      phoneNumber: null,
      phoneNumberVerified: false,
      passwordHash: null,
      fullName: 'Deleted User',
      username: `deleted_user_${user.id}`,
      totpKey: null,
      accessLevel: 0,
      avatar: null,
      deletedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  await deleteEmailVerificationRequestCookie();

  await db.delete(sessions).where(eq(sessions.id, session.id));

  (await cookies()).set('session', '', {
    httpOnly: true,
    path: '/',
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  return redirect('https://www.instagram.com/ibzimdotcom/');
}

export async function resendEmailVerificationCodeAction(): Promise<ActionResult> {
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

  await sendDeleteVerificationEmail(
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
