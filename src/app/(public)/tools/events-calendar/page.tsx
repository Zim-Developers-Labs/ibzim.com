import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { getAllEventsByApproval } from './_components/actions';
import CalendarComponents from './_components';

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
  const organizer = null; // TODO: Check this config in old ibzim repo

  return <CalendarComponents organizer={organizer} dbEvents={dbEvents} />;
}
