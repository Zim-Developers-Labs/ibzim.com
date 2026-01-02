'use server';

import { db, users } from '@/lib/server/db';
import { eq } from 'drizzle-orm';

interface ActionResponse {
  error?: string;
  done?: boolean;
}

export async function removeGoogleId(id: string): Promise<ActionResponse> {
  if (!id) {
    return {
      error: 'User does not exist',
    };
  }

  try {
    await db
      .update(users)
      .set({ googleId: null })
      .where(eq(users.googleId, id));
  } catch (err) {
    return {
      error: `${err}`,
    };
  }

  return {
    done: true,
  };
}
