import { validateRequest } from '@/lib/auth/validate-request';
import ComElements from './com-elements';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';

export const metadata = {
  title: 'Communication | Settings',
  description: 'Communication | Settings',
};

export default async function Communications() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Login);
  }

  return <ComElements user={user} />;
}
