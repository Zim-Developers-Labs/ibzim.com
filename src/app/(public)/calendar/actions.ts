'use server';

import { Event, events } from '@/server/db/schema';
import { holidayEvents, ibzimEvents } from './constants';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { SubmitEventInput, submitEventSchema } from './validators';

interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  succcesMessage?: string;
  done?: boolean;
}

export async function getEventById(eventId: string) {
  const dbEvents = await db
    .select()
    .from(events)
    .where(eq(events.approved, true));

  try {
    const allEvents = [...holidayEvents, ...ibzimEvents, ...dbEvents]; // Combine all events
    // Simulate fetching event data from a database or API
    const event = allEvents.find((event) => event.id === eventId);

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

export async function submitEvent(
  _: any,
  formData: FormData,
): Promise<ActionResponse<SubmitEventInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = submitEventSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error?.flatten();

    return {
      fieldError: {
        organizerId: err.fieldErrors.organizerId?.[0],
        category: err.fieldErrors.category?.[0],
        description: err.fieldErrors.description?.[0],
        endDate: err.fieldErrors.endDate?.[0],
        endTime: err.fieldErrors.endTime?.[0],
        entryPrice: err.fieldErrors.entryPrice?.[0],
        location: err.fieldErrors.location?.[0],
        locationLink: err.fieldErrors.locationLink?.[0],
        locationType: err.fieldErrors.locationType?.[0],
        priority: err.fieldErrors.priority?.[0],
        recurrence: err.fieldErrors.recurrence?.[0],
        startDate: err.fieldErrors.startDate?.[0],
      },
    };
  }

  const {
    category,
    description,
    endDate,
    endTime,
    location,
    locationType,
    organizerId,
    priority,
    recurrence,
    startDate,
    startTime,
    title,
    type,
    entryPrice,
    locationLink,
  } = parsed.data;

  const eventId = generateId(21);

  await db.insert(events).values({
    id: eventId,
    eventOrganizerId: organizerId,
    title,
    description,
    type,
    category,
    startTime,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    endTime,
    location,
    locationType,
    locationLink,
    priority,
    recurrence,
    entryPrice: Number(entryPrice),
  });

  return {
    done: true,
  };
}
