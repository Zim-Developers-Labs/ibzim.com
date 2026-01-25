import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes('YOUR_DATABASE_URL_HERE'),
        'You forgot to change the default URL',
      ),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    MOCK_SEND_EMAIL: z.boolean().default(false),
    MOCK_SEND_TEXT: z.boolean().default(false),
    SMTP_HOST: z.string().trim().min(1),
    SMTP_PORT: z.number().int().min(1),
    SMTP_USER: z.string().trim().min(1),
    SMTP_PASSWORD: z.string().trim().min(1),
    BLOB_READ_WRITE_TOKEN: z.string().trim().min(1),
    GA_SECRET: z.string().trim().optional(),
    SANITY_API_READ_TOKEN: z.string().trim().min(1),
    TWILIO_AUTH_TOKEN: z.string().trim().min(1),
    SMSX_API_TOKEN: z.string().trim().min(1),
    MUX_TOKEN_ID: z.string().trim().min(1),
    MUX_TOKEN_SECRET: z.string().trim().min(1),
    ENCRYPTION_KEY: z.string().trim().min(1),
    GOOGLE_CLIENT_ID: z.string().trim().min(1),
    GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().trim().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().trim().min(1),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().trim().optional(),
  },
  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT ?? ''),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    SMSX_API_TOKEN: process.env.SMSX_API_TOKEN,
    MOCK_SEND_EMAIL:
      process.env.MOCK_SEND_EMAIL === 'true' ||
      process.env.MOCK_SEND_EMAIL === '1',
    MOCK_SEND_TEXT:
      process.env.MOCK_SEND_TEXT === 'true' ||
      process.env.MOCK_SEND_TEXT === '1',
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    GA_SECRET: process.env.GA_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // Client-side env vars
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
