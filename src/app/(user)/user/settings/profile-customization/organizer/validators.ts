import { z } from 'zod';

export const createAccountSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export const nameSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be 32 characters or less'),
});

export type NameInput = z.infer<typeof nameSchema>;

export const emailSchema = z.object({
  email: z.string().email(),
});

export type EmailInput = z.infer<typeof emailSchema>;

export const whatsappNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+?[0-9]{10,14}$/,
      'Please enter a valid phone number (10-14 digits, optionally starting with +).',
    ),
});

export type WhatsappNumberInput = z.infer<typeof whatsappNumberSchema>;

export const callsNumberSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

export type CallsNumberInput = z.infer<typeof callsNumberSchema>;
