import { lucia } from '@/lib/auth';
import { siteConfig } from '@/lib/config';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const callbackUrl = searchParams.get('callbackUrl');
  const sessionId = searchParams.get('sessionId');

  const sessionCookie = lucia.createSessionCookie(sessionId!);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  if (callbackUrl) {
    return Response.redirect(callbackUrl);
  }
  return Response.redirect(`${siteConfig.url.web}/`);
}
