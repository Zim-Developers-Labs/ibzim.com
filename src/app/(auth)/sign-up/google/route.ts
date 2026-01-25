import { generateState, generateCodeVerifier } from 'arctic';
import { googleSignup } from '@/lib/server/oauth';
import { cookies } from 'next/headers';
import { globalGETRateLimit } from '@/lib/server/request';
import { NextRequest } from 'next/server';
import { env } from '@/env';
import { absoluteUrl } from '@/lib/utils';

export async function GET(request: NextRequest): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response('Too many requests', {
      status: 429,
    });
  }

  console.log('Sign-up redirect URI:', absoluteUrl('/sign-up/google/callback'));

  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get('callbackUrl');

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = googleSignup.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email',
  ]);

  (await cookies()).set('google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax',
  });
  (await cookies()).set('google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax',
  });

  if (callbackUrl) {
    (await cookies()).set('google_oauth_callbackUrl', callbackUrl, {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      sameSite: 'lax',
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
