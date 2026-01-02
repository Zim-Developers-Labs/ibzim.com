'use server';

import { db, sessions } from '@/lib/server/db';
import { desc, eq } from 'drizzle-orm';

export interface SessionData {
  id: string;
  deviceType: string | null;
  deviceName: string | null;
  browserName: string | null;
  browserVersion: string | null;
  lastActiveAt: Date;
  location: string | null;
  ipAddress: string | null;
  isCurrent: boolean;
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(
  userId: number,
  currentSessionId?: string,
): Promise<SessionData[]> {
  const userSessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .orderBy(desc(sessions.lastActiveAt));

  return userSessions.map((session) => ({
    id: session.id,
    deviceType: session.deviceType,
    deviceName: session.deviceName,
    browserName: session.browserName,
    browserVersion: session.browserVersion,
    lastActiveAt: session.lastActiveAt,
    location: session.location,
    ipAddress: session.ipAddress,
    isCurrent: session.id === currentSessionId,
  }));
}

export async function revokeSession(
  sessionId: string,
): Promise<ActionResponse> {
  try {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return { done: true };
  } catch (err) {
    return { done: false, error: `Failure: ${err}` };
  }
}

interface ActionResponse {
  done: boolean;
  error?: string;
}
