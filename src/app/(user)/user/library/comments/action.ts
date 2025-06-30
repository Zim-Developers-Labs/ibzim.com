'use server';

import { db } from '@/server/db';
import { comments } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getAllUserComments(userId: string) {
  try {
    const userComments = await db.query.comments.findMany({
      where: eq(comments.userId, userId),
      orderBy: (comments, { desc }) => [desc(comments.createdAt)],
    });

    return { comments: userComments };
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return { error: 'An error occurred while fetching user comments' };
  }
}

export async function getUserComments(userId: string, limit: number = 10) {
  try {
    const userComments = await db.query.comments.findMany({
      where: eq(comments.userId, userId),
      orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      limit: limit,
    });

    return { comments: userComments };
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return { error: 'An error occurred while fetching user comments' };
  }
}
