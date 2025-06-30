import { validateRequest } from '@/lib/auth/validate-request';
import { Paths } from '@/lib/constants';
import { redirect } from 'next/navigation';
import OrganizerFields from './fields';
import CreateProfile from './create-profile';
import { getOrganizerProfile } from './actions';

export const metadata = {
  title: 'Organizer Profile | Settings',
  description: 'Organizer Profile | Settings',
};

export default async function OrganizerProfileCustomizationPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Login);
  }

  const organizer = await getOrganizerProfile(user.id);

  if (!organizer) return <CreateProfile userId={user.id} />;

  return <OrganizerFields organizer={organizer} user={user} />;
}
