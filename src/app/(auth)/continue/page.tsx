import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { globalGETRateLimit } from '@/lib/server/request';
import ContinuePageComponents from './components';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  if (!(await globalGETRateLimit())) {
    return 'Too many requests';
  }
  const { session, user } = await getCurrentSession();
  if (session === null) {
    return redirect('/sign-in');
  }
  if (!user.emailVerified) {
    return redirect('/verify-email');
  }

  return <ContinuePageComponents callbackUrl={callbackUrl} />;
}
