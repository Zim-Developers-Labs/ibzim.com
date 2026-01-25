import { z } from 'zod';

export const fullNameSchema = z.object({
  fname: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be 32 characters or less')
    .regex(/^[A-Za-z]+$/, 'Name must only contain letters'),
  lname: z
    .string()
    .min(1, 'Surname is required')
    .max(32, 'Surname must be 32 characters or less')
    .regex(/^[A-Za-z]+$/, 'Surname must only contain letters'),
});

export type FullNameInput = z.infer<typeof fullNameSchema>;
