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
    GOOGLE_CLIENT_ID: z.string().trim().min(1),
    GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
    SMTP_HOST: z.string().trim().min(1),
    SMTP_PORT: z.number().int().min(1),
    SMTP_USER: z.string().trim().min(1),
    SMTP_PASSWORD: z.string().trim().min(1),

    SANITY_API_READ_TOKEN: z.string().trim().min(1),
    MUX_TOKEN_ID: z.string().trim().min(1),
    MUX_TOKEN_SECRET: z.string().trim().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().trim().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().trim().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server-side env vars
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT ?? ''),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    MOCK_SEND_EMAIL:
      process.env.MOCK_SEND_EMAIL === 'true' ||
      process.env.MOCK_SEND_EMAIL === '1',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    // Client-side env vars
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
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
