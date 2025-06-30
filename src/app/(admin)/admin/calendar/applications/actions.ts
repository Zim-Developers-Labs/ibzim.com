'use server';

import { db } from '@/server/db';
import {
  Event,
  events,
  OrganizerProfile,
  organizerProfiles,
} from '@/server/db/schema';
import { EventStatus } from './types';
import { eq } from 'drizzle-orm';

export async function getApplicationsData(): Promise<{
  events: Event[];
  organizers: OrganizerProfile[];
}> {
  const allEvents = await db.select().from(events).orderBy(events.startDate);

  const allOrganizers = await db.select().from(organizerProfiles);

  return {
    events: allEvents,
    organizers: allOrganizers,
  };
}

export async function updateApplicationStatus(
  eventId: string,
  status: EventStatus,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (status === 'rejected') {
      // delete the event
      await db.delete(events).where(eq(events.id, eventId));
    }

    if (status === 'approved') {
      await db
        .update(events)
        .set({
          approved: true,
          updatedAt: new Date(),
        })
        .where(eq(events.id, eventId));
    }

    return {
      success: true,
      message: 'Application status updated successfully',
    };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { success: false, error: 'Failed to update application status' };
  }
}
