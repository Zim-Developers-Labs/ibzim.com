'use server';

import { db } from '@/server/db';
import { reviewReactions, reviews, users } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { SubmitReviewInput, submitReviewSchema } from './validators';
import { generateId } from 'lucia';

export async function getReviewedProfileIds(): Promise<string[]> {
  try {
    // Get all distinct profile IDs from the reviews table
    const result = await db
      .selectDistinct({ profileId: reviews.profileId })
      .from(reviews);

    // Extract the profile IDs into a string array
    return result.map((row) => row.profileId).filter(Boolean);
  } catch (error) {
    console.error('Error fetching reviewed profile IDs:', error);
    return [];
  }
}

export async function isProfileReviewed(profileId: string): Promise<boolean> {
  try {
    // Check if the profile ID exists in the reviews table
    const result = await db
      .select({ profileId: reviews.profileId })
      .from(reviews)
      .where(eq(reviews.profileId, profileId))
      .limit(1);

    // Return true if at least one record is found
    return result.length > 0;
  } catch (error) {
    console.error('Error checking if profile is reviewed:', error);
    return false;
  }
}

export async function getReviewsForProfile(profileId: string) {
  try {
    // Get all reviews for the specific profile ID
    const result = await db
      .select({
        // Review fields
        id: reviews.id,
        profileId: reviews.profileId,
        reviewerId: reviews.reviewerId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        // User fields (nullable with leftJoin)
        userFullName: users.fullName,
        userAvatar: users.avatar,
        // Reaction counts
        yesCount: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM ${reviewReactions} 
          WHERE ${reviewReactions.reviewId} = ${reviews.id} 
          AND ${reviewReactions.reaction} = 'yes'
        ), 0)`,
        noCount: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM ${reviewReactions} 
          WHERE ${reviewReactions.reviewId} = ${reviews.id} 
          AND ${reviewReactions.reaction} = 'no'
        ), 0)`,
        funnyCount: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM ${reviewReactions} 
          WHERE ${reviewReactions.reviewId} = ${reviews.id} 
          AND ${reviewReactions.reaction} = 'funny'
        ), 0)`,
        tier1Count: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM ${reviewReactions} 
          WHERE ${reviewReactions.reviewId} = ${reviews.id} 
          AND ${reviewReactions.reaction} = 'tier1Award'
        ), 0)`,
        tier2Count: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM ${reviewReactions} 
          WHERE ${reviewReactions.reviewId} = ${reviews.id} 
          AND ${reviewReactions.reaction} = 'tier2Award'
        ), 0)`,
        tier3Count: sql<number>`COALESCE((
          SELECT COUNT(*)::int 
          FROM ${reviewReactions} 
          WHERE ${reviewReactions.reviewId} = ${reviews.id} 
          AND ${reviewReactions.reaction} = 'tier3Award'
        ), 0)`,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.profileId, profileId));

    return result;
  } catch (error) {
    console.error('Error fetching reviews for profile:', error);
    return [];
  }
}

export type ReviewWithUser = Awaited<
  ReturnType<typeof getReviewsForProfile>
>[number];

interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  successMessage?: string;
  done?: boolean;
}

export async function submitReview(
  _: any,
  formData: FormData,
): Promise<ActionResponse<SubmitReviewInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = submitReviewSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error?.flatten();

    return {
      fieldError: {
        comment: err.fieldErrors.comment?.[0],
        rating: err.fieldErrors.rating?.[0],
        profileId: err.fieldErrors.profileId?.[0],
        recommended: err.fieldErrors.recommended?.[0],
        reviewerId: err.fieldErrors.reviewerId?.[0],
      },
    };
  }

  const { profileId, rating, recommended, reviewerId, comment } = parsed.data;

  const reviewId = generateId(21);

  await db.insert(reviews).values({
    id: reviewId,
    reviewerId,
    profileId,
    rating: Number(rating).toFixed(1),
    comment,
    recommended,
  });

  return {
    done: true,
  };
}
