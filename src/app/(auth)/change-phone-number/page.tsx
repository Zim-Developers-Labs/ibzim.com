import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { globalGETRateLimit } from '@/lib/server/request';
import { Metadata } from 'next';
import ChangePhoneNumberComponents from './components';

export const metadata: Metadata = {
  title: 'Change Phone Number | IBZIM Account',
  description: 'Change your whatsapp phone number for your IBZim account.',
};

export default async function ChangePhoneNumberPage({
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

  return <ChangePhoneNumberComponents user={user} callbackUrl={callbackUrl} />;
}
