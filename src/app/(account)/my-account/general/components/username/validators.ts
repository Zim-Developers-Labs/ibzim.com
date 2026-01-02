import z from 'zod';

export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(21, 'Username must be 21 characters or less')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    )
    .refine((val) => !val.startsWith('-'), {
      message: 'Username cannot start with a hyphen',
    })
    .refine((val) => !val.endsWith('-'), {
      message: 'Username cannot end with a hyphen',
    })
    .refine(
      (val) => {
        const alphanumericCount = val.replace(/[_-]/g, '').length;
        return alphanumericCount >= 3;
      },
      {
        message: 'Username must contain at least 3 letters or numbers',
      },
    )
    .refine(
      (val) => {
        const onlySpecialChars = /^[_-]+$/.test(val);
        return !onlySpecialChars;
      },
      {
        message: 'Username cannot contain only hyphens and underscores',
      },
    ),
});

export type UsernameInput = z.infer<typeof usernameSchema>;
