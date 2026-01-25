'use server';

import { db, reviews } from '@/lib/server/db';
import { eq, sql } from 'drizzle-orm';

export async function getReviewsCountAndAverageReviewByProfile(
  profileId: string,
): Promise<{ count: number; average: number }> {
  try {
    const result = await db
      .select({
        count: sql<number>`COUNT(*)::int`,
        average: sql<number>`COALESCE(AVG(${reviews.rating}::numeric), 0)::numeric`,
      })
      .from(reviews)
      .where(eq(reviews.profileId, profileId));

    const { count, average } = result[0] || { count: 0, average: 0 };

    return {
      count,
      average: Number(Number(average).toFixed(1)),
    };
  } catch (error) {
    console.error(
      'Error fetching reviews count and average for profile:',
      error,
    );
    return { count: 0, average: 0 };
  }
}
