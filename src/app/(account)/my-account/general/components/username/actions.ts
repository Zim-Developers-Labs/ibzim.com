'use server';
import { db } from '@/lib/server/db';
import { users } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { UsernameInput, usernameSchema } from './validators';
import { headers } from 'next/headers';
import { canCheckUsername } from './rate-limit';
import { getCachedUsernameCheck, setCachedUsernameCheck } from './cache';

interface ActionResult<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  done?: boolean;
}

export async function updateUsername(
  _: any,
  formData: FormData,
): Promise<ActionResult<UsernameInput>> {
  const obj = Object.fromEntries(formData.entries());

  const userId = Number(formData.get('userId'));

  const parsed = usernameSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        username: err.fieldErrors.username?.[0],
      },
    };
  }

  if (!userId || isNaN(userId)) {
    return {
      formError: 'Invalid or missing user ID',
    };
  }

  const { username } = parsed.data;

  if (username !== '') {
    await db
      .update(users)
      .set({ username: username })
      .where(eq(users.id, userId));
    return { done: true };
  } else {
    return { error: 'Failed to update display name' };
  }
}

export async function checkUsernameAvailability(
  username: string,
): Promise<{ available: boolean; error?: string }> {
  // Note: Assumes X-Forwarded-For will always be defined (is always defined on Vercel).
  const clientIP = (await headers()).get('X-Forwarded-For');

  if (clientIP === null) {
    return { available: false, error: 'Rate limit exceeded' };
  }

  // ✅ rate limit (15 checks per minute per IP)
  if (!canCheckUsername(clientIP)) {
    return {
      available: false,
      error: 'Too many requests. Please try again in 60 seconds.',
    };
  }

  // ✅ check cache first
  const cached = getCachedUsernameCheck(username);
  if (cached !== null) {
    return { available: cached };
  }

  const existingUsername = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, username),
  });

  const available = !existingUsername;
  setCachedUsernameCheck(username, available);

  return {
    available,
    error: available ? undefined : 'Username is already taken',
  };
}
