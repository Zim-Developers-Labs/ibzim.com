'use server';

import { Event, events } from '@/server/db/schema';
import { holidayEvents, ibzimEvents } from './constants';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';

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

export async function getAllEventsByApproval(
  approval: boolean,
): Promise<Event[]> {
  const dbEvents = await db
    .select()
    .from(events)
    .where(eq(events.approved, approval));

  return dbEvents;
}
