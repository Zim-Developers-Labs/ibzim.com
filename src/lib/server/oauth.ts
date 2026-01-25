import { Google } from 'arctic';
import { absoluteUrl } from '../utils';
import { env } from '@/env';

export const googleSignup = new Google(
  env.GOOGLE_CLIENT_ID ?? '',
  env.GOOGLE_CLIENT_SECRET ?? '',
  absoluteUrl('/sign-up/google/callback'),
);

export const googleSignin = new Google(
  env.GOOGLE_CLIENT_ID ?? '',
  env.GOOGLE_CLIENT_SECRET ?? '',
  absoluteUrl('/sign-in/google/callback'),
);
