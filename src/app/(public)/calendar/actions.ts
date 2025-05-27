'use server';

import { sampleEvents } from './constants';

export async function getEventById(eventId: string) {
  try {
    // Simulate fetching event data from a database or API
    const event = sampleEvents.find((event) => event.id === eventId);

    if (!event) {
      return { error: 'Event not found' };
    }

    return { event };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { error: 'Failed to fetch event' };
  }
}
