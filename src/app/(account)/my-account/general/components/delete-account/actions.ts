'use server';
import { env } from '@/env';
import { EmailTemplate, sendMail } from '@/lib/email';
import { db } from '@/lib/server/db';
import { emailVerificationRequests } from '@/lib/server/db/schema';
import { encodeBase32, encodeBase32UpperCaseNoPadding } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

function generateRandomOTP(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const code = encodeBase32UpperCaseNoPadding(bytes);
  return code;
}

export async function createEmailVerificationRequest(
  userId: number,
  email: string,
): Promise<void> {
  // deleteUserEmailVerificationRequest
  await db
    .delete(emailVerificationRequests)
    .where(eq(emailVerificationRequests.userId, userId));

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

  (await cookies()).set('email_verification', id, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });

  await sendMail(email, EmailTemplate.DeleteVerification, {
    code: code,
  });
}
