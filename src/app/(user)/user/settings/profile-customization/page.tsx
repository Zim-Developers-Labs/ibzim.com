import { validateRequest } from '@/lib/auth/validate-request';
import { Paths } from '@/lib/constants';
import { redirect } from 'next/navigation';
import CustomizationFields from './customization-fields';

export const metadata = {
  title: 'Customize Profile | Settings',
  description: 'Customize Profile | Settings',
};

export default async function ProfileCustomizationPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Login);
  }

  return <CustomizationFields user={user} />;
}
