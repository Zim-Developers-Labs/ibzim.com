'use server';

import { db, votes, VotesType } from '@/lib/server/db';
import { and, eq } from 'drizzle-orm';

export async function getAllTitleVotes(
  titleId: string,
): Promise<VotesType[] | null> {
  const titleVotes = await db
    .select()
    .from(votes)
    .where(eq(votes.titleId, titleId));

  if (titleVotes.length > 0) {
    return titleVotes;
  }

  return null;
}

export async function getAllUserCategoryVotes(
  userId: number,
  categoryId: string,
): Promise<VotesType[] | null> {
  const userVotes = await db
    .select()
    .from(votes)
    .where(and(eq(votes.userId, userId), eq(votes.categoryId, categoryId)));

  if (userVotes.length > 0) {
    return userVotes;
  }

  return null;
}
