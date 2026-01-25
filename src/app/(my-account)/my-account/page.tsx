import { Metadata } from 'next';
import HomeComponents from './components';
import { globalGETRateLimit } from '@/lib/server/request';
import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'IBZim Account Centre',
  description:
    'Manage your IBZim account settings and preferences in one place.',
};

export default async function HomePage() {
  if (!(await globalGETRateLimit())) {
    return 'Too many requests';
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect(`/sign-in`);
  }

  return <HomeComponents />;
}
