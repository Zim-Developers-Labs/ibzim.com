'use server';

import { db } from '@/lib/server/db';
import { users } from '@/lib/server/db/schema';
import { FullNameInput, fullNameSchema } from './validators';
import { eq } from 'drizzle-orm';

interface ActionResult<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  done?: boolean;
}

export async function updateAvatarUrl(avatarUrl: string, userId: number) {
  if (avatarUrl != '') {
    await db
      .update(users)
      .set({ avatar: avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, userId));
  } else {
    throw new Error('Failed to update avatar url');
  }
}

export async function updateDisplayName(
  _: any,
  formData: FormData,
): Promise<ActionResult<FullNameInput>> {
  const obj = Object.fromEntries(formData.entries());

  const userId = Number(formData.get('userId'));

  const parsed = fullNameSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        fname: err.fieldErrors.fname?.[0],
        lname: err.fieldErrors.lname?.[0],
      },
    };
  }

  if (!userId || isNaN(userId)) {
    return {
      formError: 'Invalid or missing user ID',
    };
  }

  const { fname, lname } = parsed.data;

  if (fname != '' && lname != '') {
    await db
      .update(users)
      .set({ fullName: `${fname} ${lname}`, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return { done: true };
  } else {
    return { error: 'Failed to update display name' };
  }
}
