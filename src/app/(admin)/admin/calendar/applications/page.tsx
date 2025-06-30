import { Metadata } from 'next';
import CalendarApplicationsWrapper from './wrapper';
import { getApplicationsData } from './actions';

export const metadata: Metadata = {
  title: 'Applications | Calendar',
  description: 'IBZim Application Manager',
};

export default async function CalendarApplicationsPage() {
  const { events, organizers } = await getApplicationsData();
  return (
    <CalendarApplicationsWrapper
      allEvents={events}
      allOrganizers={organizers}
    />
  );
}
