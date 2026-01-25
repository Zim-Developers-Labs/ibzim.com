import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { globalGETRateLimit } from '@/lib/server/request';
import ChangeEmailComponents from './components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Email | IBZIM Account',
  description: 'Change your email address for your IBZim account.',
};

export default async function ChangeEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  if (!(await globalGETRateLimit())) {
    return 'Too many requests';
  }
  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect('/sign-in');
  }

  return <ChangeEmailComponents user={user} callbackUrl={callbackUrl} />;
}
