import { siteConfig } from '@/lib/config';
import CalendarWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { getAllEventsByApproval } from './actions';
import { validateRequest } from '@/lib/auth/validate-request';
import { getOrganizerProfile } from '@/app/(user)/user/settings/profile-customization/organizer/actions';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Events Calendar | IBZim`,
    description: `Stay updated with the latest events and activities in Zimbabwe, Check out the IBZim Calendar for upcoming events.`,
    pageUrl: '/tools/events-calendar',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function CalendarPage() {
  const dbEvents = await getAllEventsByApproval(true);
  const { user } = await validateRequest();
  const organizer = user ? await getOrganizerProfile(user.id) : null;

  return (
    <CalendarWrapper organizer={organizer} user={user} dbEvents={dbEvents} />
  );
}
