'use server';

import { db } from '@/server/db';
import {
  Event,
  events,
  OrganizerProfile,
  organizerProfiles,
} from '@/server/db/schema';

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
