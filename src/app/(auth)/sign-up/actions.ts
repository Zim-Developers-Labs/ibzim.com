'use server';

import { checkEmailAvailability } from '@/lib/server/email';
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from '@/lib/server/email-verification';
import { verifyPasswordStrength } from '@/lib/server/password';
import { RefillingTokenBucket } from '@/lib/server/rate-limit';
import { createSession, setSessionTokenCookie } from '@/lib/server/session';
import { createUser } from '@/lib/server/user';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { globalPOSTRateLimit } from '@/lib/server/request';

import {
  generateSessionToken,
  SessionFlags,
  verifyEmailInput,
  verifyUsernameInput,
} from '@/lib/server/constants';

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function signupAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!globalPOSTRateLimit()) {
    return {
      message: 'Too many requests',
    };
  }

  // TODO: Assumes X-Forwarded-For is always included.
  const clientIP = (await headers()).get('X-Forwarded-For');
  if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
    return {
      message: 'Too many requests',
    };
  }

  const email = formData.get('email');
  const fname = formData.get('fname');
  const lname = formData.get('lname');
  const password = formData.get('password');
  const callbackUrl = String(formData.get('callbackUrl'));

  if (
    typeof email !== 'string' ||
    typeof fname !== 'string' ||
    typeof lname !== 'string' ||
    typeof password !== 'string'
  ) {
    return {
      message: 'Invalid or missing fields',
    };
  }
  if (email === '' || password === '' || fname === '' || lname === '') {
    return {
      message: 'Please enter your name, email, and password',
    };
  }
  if (!verifyEmailInput(email)) {
    return {
      message: 'Invalid email',
    };
  }
  const emailAvailable = await checkEmailAvailability(email);

  if (!emailAvailable) {
    return {
      message: 'Email is already used, login or use a different email',
    };
  }

  if (!verifyUsernameInput(fname)) {
    return {
      message: 'Invalid firstname input',
    };
  }
  if (!verifyUsernameInput(lname)) {
    return {
      message: 'Invalid lastname input',
    };
  }
  const strongPassword = await verifyPasswordStrength(password);
  if (!strongPassword) {
    return {
      message: 'Weak password',
    };
  }
  if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
    return {
      message: 'Too many requests',
    };
  }
  const name = `${fname} ${lname}`;
  const user = await createUser(email, name, password);
  const emailVerificationRequest = await createEmailVerificationRequest(
    user.id,
    user.email,
  );
  await sendVerificationEmail(
    emailVerificationRequest.email,
    emailVerificationRequest.code,
  );
  await setEmailVerificationRequestCookie(emailVerificationRequest);

  const sessionFlags: SessionFlags = {
    twoFactorVerified: false,
  };
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id, sessionFlags);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect(
    `/verify-email${callbackUrl === '' ? '' : `?callbackUrl=${callbackUrl}`}`,
  );
}

interface ActionResult {
  message: string;
}
