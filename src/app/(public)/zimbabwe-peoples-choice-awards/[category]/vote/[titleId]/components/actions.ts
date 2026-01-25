'use server';

import { incrementUserIP } from '@/app/(user)/u/actions';
import { db, votes, VotesType } from '@/lib/server/db';

interface ActionResponse {
  error?: string;
  vote?: VotesType;
}

export async function submitVote(
  userId: number,
  username: string,
  userIp: number,
  nomineeId: string,
  titleId: string,
  categoryId: string,
): Promise<ActionResponse> {
  try {
    const [submittedVote] = await db
      .insert(votes)
      .values({
        userId,
        categoryId,
        nomineeId,
        titleId,
      })
      .returning();

    await incrementUserIP(userId, username, userIp + 20, userIp);

    return {
      vote: submittedVote, // Contains id, userId, nomineeId, titleId, createdAt
    };
  } catch (err) {
    return {
      error: `${err}`,
    };
  }
}
