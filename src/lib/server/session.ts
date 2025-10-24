'use server';

import { db } from './db';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { sessions, users } from './db/schema';
import {
  Session,
  SessionFlags,
  SessionValidationResult,
  User,
} from './constants';
import { UAParser } from 'ua-parser-js';
import { getLocationFromIP } from '@/lib/server/geolocation';
import { env } from '@/env';

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const rows = await db
    .select({
      sessionId: sessions.id,
      sessionUserId: sessions.userId,
      sessionExpiresAt: sessions.expiresAt,
      sessionTwoFactorVerified: sessions.twoFactorVerified,
      userId: users.id,
      userEmail: users.email,
      userUsername: users.username,
      userEmailVerified: users.emailVerified,
      userHasTotp: users.totpKey,
      userFullName: users.fullName,
      userAvatar: users.avatar,
      userPhoneNumber: users.phoneNumber,
      accessLevel: users.accessLevel,
      userGoogleId: users.googleId,
      userIP: users.ip,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));

  if (rows.length === 0) {
    return { session: null, user: null };
  }

  const row = rows[0];

  const session: Session = {
    id: row.sessionId,
    userId: row.userId,
    expiresAt: new Date(row.sessionExpiresAt * 1000),
    twoFactorVerified: Boolean(row.sessionTwoFactorVerified),
  };
  const user: User = {
    id: row.userId,
    email: row.userEmail,
    fullName: row.userFullName,
    username: row.userUsername,
    emailVerified: row.userEmailVerified,
    registered2FA: Boolean(row.userHasTotp),
    accessLevel: row.accessLevel,
    avatar: row.userAvatar,
    phoneNumber: row.userPhoneNumber,
    googleId: row.userGoogleId,
    ip: row.userIP,
  };
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessions)
      .set({ expiresAt: Math.floor(session.expiresAt.getTime() / 1000) })
      .where(eq(sessions.id, session.id));

    await updateSessionActivity(session.id);
  }
  return { session, user };
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = (await cookies()).get('session')?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateUserSessions(userId: number): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  (await cookies()).set('session', token, {
    httpOnly: true,
    ...(env.NODE_ENV === 'production' ? { domain: '.ibzim.com' } : {}),
    path: '/',
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  (await cookies()).set('session', '', {
    httpOnly: true,
    ...(env.NODE_ENV === 'production' ? { domain: '.ibzim.com' } : {}),
    path: '/',
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
}

/**
 * Parse user agent string to extract device and browser information
 */
function parseUserAgent(userAgent: string): {
  deviceType: string;
  deviceName: string;
  browserName: string;
  browserVersion: string;
} {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let deviceType = 'desktop';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  }

  // Get device name
  let deviceName = 'Unknown Device';
  if (result.device.vendor && result.device.model) {
    deviceName = `${result.device.vendor} ${result.device.model}`;
  } else if (result.os.name) {
    if (deviceType === 'mobile') {
      deviceName = `${result.os.name} Phone`;
    } else if (deviceType === 'tablet') {
      deviceName = `${result.os.name} Tablet`;
    } else {
      deviceName =
        `${result.os.name} ${result.os.version || ''}`.trim() || 'Desktop';
    }
  }

  // Get browser info
  const browserName = result.browser.name || 'Unknown';
  const browserVersion = result.browser.version?.split('.')[0] || '';

  return { deviceType, deviceName, browserName, browserVersion };
}

/**
 * Update session activity (call this on each request to keep lastActiveAt current)
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  let ipAddress =
    headersList.get('x-forwarded-for') || headersList.get('x-real-ip');

  if (ipAddress === '::1') {
    ipAddress = '197.221.251.116';
  }

  // Parse user agent if not already set
  const sessionResults = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  const session = sessionResults[0];

  const updates: any = {
    lastActiveAt: new Date(),
  };

  // Only parse and update device/browser info if not already set
  if (!session.deviceType || !session.browserName) {
    const { deviceType, deviceName, browserName, browserVersion } =
      parseUserAgent(userAgent);
    updates.deviceType = deviceType;
    updates.deviceName = deviceName;
    updates.browserName = browserName;
    updates.browserVersion = browserVersion;
    updates.userAgent = userAgent;
  }

  if (ipAddress && !session.ipAddress) {
    updates.ipAddress = ipAddress;
    const location = await getLocationFromIP(ipAddress);
    if (location) {
      updates.location = location;
    }
  }

  await db.update(sessions).set(updates).where(eq(sessions.id, sessionId));
}

export async function createSession(
  token: string,
  userId: number,
  flags: SessionFlags,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    twoFactorVerified: flags.twoFactorVerified,
  };

  await db.insert(sessions).values({
    id: session.id,
    userId: session.userId,
    expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
    twoFactorVerified: session.twoFactorVerified,
  });

  return session;
}

export async function setSessionAs2FAVerified(
  sessionId: string,
): Promise<void> {
  await db
    .update(sessions)
    .set({ twoFactorVerified: true })
    .where(eq(sessions.id, sessionId));
}
