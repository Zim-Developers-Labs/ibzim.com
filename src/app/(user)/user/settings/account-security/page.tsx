import { validateRequest } from '@/lib/auth/validate-request';
import SecurityFields from './security-fields';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';

export const metadata = {
  title: 'Account Security | Settings',
  description: 'Account Security | Settings',
};

export default async function AccountSecurity() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Login);
  }

  return <SecurityFields user={user} />;
}
