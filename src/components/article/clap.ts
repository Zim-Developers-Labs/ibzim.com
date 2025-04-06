'use server';

import { db } from '@/server/db';
import { articleClaps } from '@/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function toggleClap(articleId: string, userId: string) {
  try {
    // Check if the user has already clapped
    const existingClap = await db.query.articleClaps.findFirst({
      where: and(
        eq(articleClaps.articleId, articleId),
        eq(articleClaps.userId, userId),
      ),
    });

    if (existingClap) {
      // User has already clapped, so we'll remove their clap
      await db
        .delete(articleClaps)
        .where(
          and(
            eq(articleClaps.articleId, articleId),
            eq(articleClaps.userId, userId),
          ),
        );
    } else {
      // User hasn't clapped yet, so we'll add their clap
      await db.insert(articleClaps).values({ articleId, userId });
    }

    // Get the updated clap count
    const result = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(articleClaps)
      .where(eq(articleClaps.articleId, articleId));

    const count = result[0]?.count ?? 0;

    return { success: true, claps: count, userClapped: !existingClap };
  } catch (error) {
    console.error('Error updating claps:', error);
    return { success: false, error: 'Failed to update claps' };
  }
}

export async function getClaps(articleId: string, userId?: string) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(articleClaps)
      .where(eq(articleClaps.articleId, articleId));

    const count = result[0]?.count ?? 0;

    let userClapped = false;
    if (userId) {
      const existingClap = await db.query.articleClaps.findFirst({
        where: and(
          eq(articleClaps.articleId, articleId),
          eq(articleClaps.userId, userId),
        ),
      });
      userClapped = !!existingClap;
    }

    return { success: true, claps: count, userClapped };
  } catch (error) {
    console.error('Error fetching claps:', error);
    return { success: false, error: 'Failed to fetch claps' };
  }
}
