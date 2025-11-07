'use server';

import { db, votes } from '@/lib/server/db';

interface ActionResponse {
  error?: string;
  done?: boolean;
}

export async function submitVote(
  voterId: string,
  nomineeId: string,
  titleId: string,
): Promise<ActionResponse> {
  try {
    await db.insert(votes).values({
      voterId: Number(voterId),
      nomineeId,
      titleId,
    });
  } catch (err) {
    return {
      error: `${err}`,
    };
  }

  return {
    done: true,
  };
}
