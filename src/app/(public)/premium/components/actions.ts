'use server';

import { eq, sql } from 'drizzle-orm';
import { SubscribeInput, subscribeSchema } from './validators';
import { db, users } from '@/lib/server/db';

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  done?: boolean;
}

export async function subscribe(
  _: any,
  formData: FormData,
): Promise<ActionResponse<SubscribeInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = subscribeSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        userId: err.fieldErrors.userId?.[0],
        tierId: err.fieldErrors.tierId?.[0],
        endDate: err.fieldErrors.endDate?.[0],
        tierPoints: err.fieldErrors.tierPoints?.[0],
      },
    };
  }

  const { userId, tierId, endDate, tierPoints } = parsed.data;

  const date = new Date(endDate);

  try {
    // 4 second delay to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return {
      done: true,
    };
  } catch (error) {
    return {
      error: `Failed to subscribe: ${error}`,
    };
  }
}
