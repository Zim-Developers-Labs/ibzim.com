import z from 'zod';

export const subscribeSchema = z.object({
  userId: z.string().min(1, 'Invalid or missing User ID'),
  tierId: z.string().min(1, 'Invalid or missing Tier ID'),
  tierPoints: z.string().min(1, 'Invalid or missing Tier Details'),
  endDate: z.string().min(1, 'Invalid or missing Tier Details'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
