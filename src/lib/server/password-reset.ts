'use server';

import { db } from './db';
import { passwordResetSessions, users } from './db/schema';
import { eq } from 'drizzle-orm';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { cookies } from 'next/headers';
import { generateRandomOTP } from '../utils';
import {
  PasswordResetSession,
  PasswordResetSessionValidationResult,
  User,
} from './constants';
import { env } from '@/env';

export async function createPasswordResetSession(
  token: string,
  userId: number,
  email: string,
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    code: generateRandomOTP(),
    emailVerified: false,
    twoFactorVerified: false,
  };

  await db.insert(passwordResetSessions).values({
    id: session.id,
    userId: session.userId,
    email: session.email,
    code: session.code,
    expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
    emailVerified: false,
    twoFactorVerified: false,
  });

  return session;
}

export async function validatePasswordResetSessionToken(
  token: string,
): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({
      sessionId: passwordResetSessions.id,
      sessionUserId: passwordResetSessions.userId,
      sessionEmail: passwordResetSessions.email,
      sessionCode: passwordResetSessions.code,
      sessionExpiresAt: passwordResetSessions.expiresAt,
      sessionEmailVerified: passwordResetSessions.emailVerified,
      sessionTwoFactorVerified: passwordResetSessions.twoFactorVerified,
      userId: users.id,
      userEmail: users.email,
      username: users.username,
      userEmailVerified: users.emailVerified,
      userFullName: users.fullName,
      userAccessLevel: users.accessLevel,
      totpKey: users.totpKey,
      userIP: users.ip,
    })
    .from(passwordResetSessions)
    .innerJoin(users, eq(users.id, passwordResetSessions.userId))
    .where(eq(passwordResetSessions.id, sessionId))
    .limit(1);

  if (result.length === 0) {
    return { session: null, user: null };
  }

  const row = result[0];
  const session: PasswordResetSession = {
    id: row.sessionId,
    userId: row.sessionUserId,
    email: row.sessionEmail,
    code: row.sessionCode,
    expiresAt: new Date(row.sessionExpiresAt * 1000),
    emailVerified: row.sessionEmailVerified,
    twoFactorVerified: row.sessionTwoFactorVerified,
  };

  const user: User = {
    ip: row.userIP,
    fullName: row.userFullName,
    accessLevel: row.userAccessLevel,
    id: row.userId,
    email: row.userEmail,
    username: row.username,
    emailVerified: row.userEmailVerified,
    registered2FA: row.totpKey !== null,
  };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db
      .delete(passwordResetSessions)
      .where(eq(passwordResetSessions.id, session.id));
    return { session: null, user: null };
  }

  return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(
  sessionId: string,
): Promise<void> {
  await db
    .update(passwordResetSessions)
    .set({ emailVerified: true })
    .where(eq(passwordResetSessions.id, sessionId));
}

export async function setPasswordResetSessionAs2FAVerified(
  sessionId: string,
): Promise<void> {
  await db
    .update(passwordResetSessions)
    .set({ twoFactorVerified: true })
    .where(eq(passwordResetSessions.id, sessionId));
}

export async function invalidateUserPasswordResetSessions(
  userId: number,
): Promise<void> {
  await db
    .delete(passwordResetSessions)
    .where(eq(passwordResetSessions.userId, userId));
}

export async function validatePasswordResetSessionRequest(): Promise<PasswordResetSessionValidationResult> {
  const token = (await cookies()).get('password_reset_session')?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validatePasswordResetSessionToken(token);
  if (result.session === null) {
    await deletePasswordResetSessionTokenCookie();
  }
  return result;
}

export async function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  (await cookies()).set('password_reset_session', token, {
    expires: expiresAt,
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
    secure: env.NODE_ENV === 'production',
  });
}

export async function deletePasswordResetSessionTokenCookie(): Promise<void> {
  (await cookies()).set('password_reset_session', '', {
    maxAge: 0,
    sameSite: 'lax',
    httpOnly: true,
    path: '/',
    secure: env.NODE_ENV === 'production',
  });
}
