'use server';

import { demoAnswerLikes } from '@/data/demo';
import { db } from '@/server/db';
import { answerLikes } from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function getAnswerLikes(answerId: string, userId?: string) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(answerLikes)
      .where(eq(answerLikes.answerId, answerId));

    const count = result[0]?.count ?? 0;

    let userLiked = false;
    if (userId) {
      const existingLike = await db.query.answerLikes.findFirst({
        where: and(
          eq(answerLikes.answerId, answerId),
          eq(answerLikes.userId, userId),
        ),
      });
      userLiked = !!existingLike;
    }

    // add demo data
    const demoLikes = demoAnswerLikes.filter(
      (like) => like.answerId === answerId,
    );

    const likes = Number(count) + demoLikes.length;

    return { success: true, likes, userLiked };
  } catch (error) {
    console.error('Error fetching answer likes:', error);
    return { success: false, error: 'Failed to fetch likes' };
  }
}

export async function toggleAnswerLike(answerId: string, userId: string) {
  try {
    const existingLike = await db.query.answerLikes.findFirst({
      where: and(
        eq(answerLikes.answerId, answerId),
        eq(answerLikes.userId, userId),
      ),
    });

    if (existingLike) {
      await db
        .delete(answerLikes)
        .where(
          and(
            eq(answerLikes.answerId, answerId),
            eq(answerLikes.userId, userId),
          ),
        );
    } else {
      // User hasnt liked yet, so we'll add their like
      await db.insert(answerLikes).values({ answerId, userId });
    }

    // Get the updated likes count
    const result = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(answerLikes)
      .where(eq(answerLikes.answerId, answerId));

    const count = result[0]?.count ?? 0;

    // add demo data
    const demoLikes = demoAnswerLikes.filter(
      (like) => like.answerId === answerId,
    );

    const likes = Number(count) + demoLikes.length;

    return { success: true, likes, userLiked: !existingLike };
  } catch (error) {
    console.error('Error updating likes:', error);
    return { success: false, error: 'Failed to update likes' };
  }
}
