'use server';

import { holidayEvents, ibzimEvents } from './constants';

export async function getEventById(eventId: string) {
  try {
    const events = [...holidayEvents, ...ibzimEvents]; // Combine all events
    // Simulate fetching event data from a database or API
    const event = events.find((event) => event.id === eventId);

    if (!event) {
      return { error: 'Event not found' };
    }

    return { event };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { error: 'Failed to fetch event' };
  }
}
