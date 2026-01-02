'use server';

import { generateRandomOTP } from '../utils';
import { db } from './db';
import { encodeBase32 } from '@oslojs/encoding';
import { cookies } from 'next/headers';
import { getCurrentSession } from './session';
import { and, eq } from 'drizzle-orm';
import { emailVerificationRequests } from './db/schema';
import { EmailVerificationRequest } from './constants';
import { EmailTemplate, sendMail } from '../email';
import { env } from '@/env';

export async function getUserEmailVerificationRequest(
  userId: number,
  id: string,
): Promise<EmailVerificationRequest | null> {
  const dbRequest = await db.query.emailVerificationRequests.findFirst({
    where: and(
      eq(emailVerificationRequests.id, id),
      eq(emailVerificationRequests.userId, userId),
    ),
  });

  if (!dbRequest) {
    return null;
  }

  const request: EmailVerificationRequest = {
    id: dbRequest.id,
    userId: dbRequest.userId,
    code: dbRequest.code,
    email: dbRequest.email,
    expiresAt: new Date(dbRequest.expiresAt * 1000),
  };
  return request;
}

export async function createEmailVerificationRequest(
  userId: number,
  email: string,
): Promise<EmailVerificationRequest> {
  deleteUserEmailVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
  await db.insert(emailVerificationRequests).values({
    id,
    userId,
    code,
    email,
    expiresAt: Math.floor(expiresAt.getTime() / 1000),
  });

  const request: EmailVerificationRequest = {
    id,
    userId,
    code,
    email,
    expiresAt,
  };
  return request;
}

export async function deleteUserEmailVerificationRequest(
  userId: number,
): Promise<void> {
  await db
    .delete(emailVerificationRequests)
    .where(eq(emailVerificationRequests.userId, userId));
}

export async function sendVerificationEmail(
  email: string,
  code: string,
): Promise<void> {
  await sendMail(email, EmailTemplate.EmailVerification, {
    code: code,
  });
}

export async function sendDeleteVerificationEmail(
  email: string,
  code: string,
): Promise<void> {
  await sendMail(email, EmailTemplate.DeleteVerification, {
    code: code,
  });
}

export async function setEmailVerificationRequestCookie(
  request: EmailVerificationRequest,
): Promise<void> {
  (await cookies()).set('email_verification', request.id, {
    httpOnly: true,
    path: '/',
    ...(env.NODE_ENV === 'production' ? { domain: '.ibzim.com' } : {}),
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: request.expiresAt,
  });
}

export async function deleteEmailVerificationRequestCookie(): Promise<void> {
  (await cookies()).set('email_verification', '', {
    httpOnly: true,
    path: '/',
    ...(env.NODE_ENV === 'production' ? { domain: '.ibzim.com' } : {}),
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
}

export async function getUserEmailVerificationRequestFromRequest(): Promise<EmailVerificationRequest | null> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }
  const id = (await cookies()).get('email_verification')?.value ?? null;
  if (id === null) {
    return null;
  }
  const request = getUserEmailVerificationRequest(user.id, id);
  if (request === null) {
    await deleteEmailVerificationRequestCookie();
  }
  return request;
}
