import { Metadata } from 'next';
import CalendarPageWrapper from './wrapper';

export const metadata: Metadata = {
  title: 'IB Calendar',
};

export default function CalendarPage() {
  return <CalendarPageWrapper />;
}
