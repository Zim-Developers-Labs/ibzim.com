import { createSession, setSessionTokenCookie } from '@/lib/server/session';
import { googleSignin } from '@/lib/server/oauth';
import { cookies } from 'next/headers';
import { getUserFromGoogleId } from '@/lib/server/user';
import { ObjectParser } from '@pilcrowjs/object-parser';
import { globalGETRateLimit } from '@/lib/server/request';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { generateSessionToken, SessionFlags } from '@/lib/server/constants';
import { DOMAIN_URLS } from '@/lib/constants';

export async function GET(request: Request): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response('Too many requests', {
      status: 429,
    });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState =
    (await cookies()).get('google_oauth_state')?.value ?? null;
  const codeVerifier =
    (await cookies()).get('google_code_verifier')?.value ?? null;
  const callbackUrl =
    (await cookies()).get('google_oauth_callbackUrl')?.value ?? null;

  // Clear the cookies after use
  (await cookies()).set('google_oauth_state', '', { maxAge: 0 });
  (await cookies()).set('google_code_verifier', '', { maxAge: 0 });
  (await cookies()).set('google_oauth_callbackUrl', '', { maxAge: 0 });

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await googleSignin.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return new Response('Please restart the process.', {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  const googleId = claimsParser.getString('sub');

  const sessionFlags: SessionFlags = {
    twoFactorVerified: false,
  };

  const user = await getUserFromGoogleId(googleId);

  if (user === null) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/sign-in?error=ib_nf${callbackUrl ? `&callbackUrl=${callbackUrl}` : ''}`,
      },
    });
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id, sessionFlags);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: callbackUrl ? callbackUrl : DOMAIN_URLS.MAIN(),
    },
  });
}
