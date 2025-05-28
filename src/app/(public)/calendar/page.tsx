import { siteConfig } from '@/lib/config';
import CalendarWrapper from './wrapper';
import { preparePageMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Events Calendar | IBZim`,
    description: `Stay updated with the latest events and activities in Zimbabwe, Check out the IBZim Calendar for upcoming events.`,
    pageUrl: '/calendar',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default function CalendarPage() {
  return <CalendarWrapper />;
}
