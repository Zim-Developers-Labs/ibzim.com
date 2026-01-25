import { z } from 'zod';

const validRecommendation = ['yes', 'no', 'neutral'] as const;

const RecommendationsEnum = z.enum(validRecommendation);

export const submitReviewSchema = z.object({
  rating: z.string().min(1, 'Rating is required'),
  profileId: z.string().min(1, 'Organizer ID is required'),
  reviewerId: z.string().min(1, 'Reviewer ID is required'),
  comment: z.string().max(1000).optional(),
  recommended: RecommendationsEnum.default('neutral'),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export type RecommendedType = z.infer<typeof RecommendationsEnum>;
