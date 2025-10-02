import { z } from 'zod';

// Schema for full name validation
export const fullNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(32, 'Name must be 32 characters or less'),
});

export type FullNameInput = z.infer<typeof fullNameSchema>;

// Schema for username validation
export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(48, 'Username must be 48 characters or less')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    ),
});

export type UsernameInput = z.infer<typeof usernameSchema>;

// Schema for phone number validation
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+?[0-9]{10,14}$/,
      'Please enter a valid phone number (10-14 digits, optionally starting with +).',
    ),
});

export type PhoneNumberInput = z.infer<typeof phoneNumberSchema>;

export const changeEmailSchema = z.object({
  userId: z.string(),
  currentEmail: z.string(),
  newEmail: z.string().email(),
  confirmNewEmail: z.string().email(),
  currentPassword: z.string().min(8),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

export const changePasswordSchema = z.object({
  userId: z.string(),
  currentPassword: z.string(),
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(8),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
