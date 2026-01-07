'use server';

import { generateRandomOTP } from '../utils';
import { db } from './db';
import { encodeBase32 } from '@oslojs/encoding';
import { cookies } from 'next/headers';
import { getCurrentSession } from './session';
import { and, eq } from 'drizzle-orm';
import { phoneNumberVerificationRequests } from './db/schema';
import { PhoneNumberVerificationRequest } from './constants';
import { sendText, TextTemplate } from '../text';
import { env } from '@/env';

export async function getUserPhoneNumberVerificationRequest(
  userId: number,
  id: string,
): Promise<PhoneNumberVerificationRequest | null> {
  const dbRequest = await db.query.phoneNumberVerificationRequests.findFirst({
    where: and(
      eq(phoneNumberVerificationRequests.id, id),
      eq(phoneNumberVerificationRequests.userId, userId),
    ),
  });

  if (!dbRequest) {
    return null;
  }

  const request: PhoneNumberVerificationRequest = {
    id: dbRequest.id,
    userId: dbRequest.userId,
    code: dbRequest.code,
    phoneNumber: dbRequest.phoneNumber,
    expiresAt: new Date(dbRequest.expiresAt * 1000),
  };
  return request;
}

export async function createPhoneNumberVerificationRequest(
  userId: number,
  phoneNumber: string,
): Promise<PhoneNumberVerificationRequest> {
  deleteUserPhoneNumberVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
  await db.insert(phoneNumberVerificationRequests).values({
    id,
    userId,
    code,
    phoneNumber,
    expiresAt: Math.floor(expiresAt.getTime() / 1000),
  });

  const request: PhoneNumberVerificationRequest = {
    id,
    userId,
    code,
    phoneNumber,
    expiresAt,
  };
  return request;
}

export async function deleteUserPhoneNumberVerificationRequest(
  userId: number,
): Promise<void> {
  await db
    .delete(phoneNumberVerificationRequests)
    .where(eq(phoneNumberVerificationRequests.userId, userId));
}

export async function sendVerificationText(
  phoneNumber: string,
  code: string,
): Promise<void> {
  await sendText(phoneNumber, TextTemplate.TextVerification, {
    verificationCode: code,
  });
}

export async function setPhoneNumberVerificationRequestCookie(
  request: PhoneNumberVerificationRequest,
): Promise<void> {
  (await cookies()).set('phone_number_verification', request.id, {
    httpOnly: true,
    path: '/',
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: request.expiresAt,
  });
}

export async function deletePhoneNumberVerificationRequestCookie(): Promise<void> {
  (await cookies()).set('phone_number_verification', '', {
    httpOnly: true,
    path: '/',
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
}

export async function getUserPhoneNumberVerificationRequestFromRequest(): Promise<PhoneNumberVerificationRequest | null> {
  const { user } = await getCurrentSession();
  if (user === null) {
    return null;
  }
  const id = (await cookies()).get('phone_number_verification')?.value ?? null;
  if (id === null) {
    return null;
  }
  const request = getUserPhoneNumberVerificationRequest(user.id, id);
  if (request === null) {
    await deletePhoneNumberVerificationRequestCookie();
  }
  return request;
}
