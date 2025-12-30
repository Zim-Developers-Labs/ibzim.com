import { z } from 'zod';

// Define the valid enum values
const validEventTypes = [
  'party',
  'conference',
  'competition',
  'workshop',
  'meeting',
  'social',
  'training',
  'webinar',
  'concert',
  'festival',
  'show',
  'exhibition',
  'chat',
  'awards',
  'chillout',
] as const;

const validEventCategories = [
  'holiday',
  'business',
  'tech',
  'community',
  'school',
  'music',
  'religious',
  'public',
  'ibzim',
  'casual',
  'sports',
] as const;

const validLocationTypes = ['virtual', 'physical'] as const;
const validPriorities = ['high', 'medium', 'low'] as const;
const validRecurrences = ['none', 'monthly', 'yearly'] as const;

// Create Zod enums
const EventTypeEnum = z.enum(validEventTypes);
const EventCategoryEnum = z.enum(validEventCategories);
const LocationTypeEnum = z.enum(validLocationTypes);
const PriorityEnum = z.enum(validPriorities);
const RecurrenceEnum = z.enum(validRecurrences);

export const submitEventSchema = z
  .object({
    organizerId: z.string().min(1, 'Organizer ID is required'),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description must be less than 1000 characters'),
    type: EventTypeEnum.refine((val) => validEventTypes.includes(val), {
      message: 'Invalid event type',
    }),
    startTime: z
      .string()
      .min(1, 'Start time is required')
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid time format (HH:MM)',
      ),
    startDate: z
      .string()
      .min(1, 'Start date is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    endTime: z.string().optional(),
    endDate: z.string().optional(),
    category: EventCategoryEnum.refine(
      (val) => validEventCategories.includes(val),
      {
        message: 'Invalid event category',
      },
    ),
    location: z
      .string()
      .min(1, 'Location is required')
      .max(255, 'Location must be less than 255 characters'),
    locationType: LocationTypeEnum.refine(
      (val) => validLocationTypes.includes(val),
      {
        message: 'Invalid location type',
      },
    ),
    locationLink: z
      .string()
      .url('Invalid URL format')
      .max(
        300,
        'Max length for location link is 300 characters, use bitly or similar to shorten links.',
      )
      .optional()
      .or(z.literal('')),
    ticketsLink: z
      .string()
      .url('Invalid URL format')
      .max(
        300,
        'Max length for tickets link is 300 characters, use bitly or similar to shorten links.',
      )
      .optional()
      .or(z.literal('')),
    pricingDetails: z
      .string()
      .max(300, 'Pricing details must be less than 300 characters')
      .optional(),
    priority: PriorityEnum.default('low'),
    recurrence: RecurrenceEnum.default('none'),
    pricingTiers: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only validate if both endDate and endTime are provided
      if (!data.endDate || !data.endTime) {
        return true; // Skip validation if end date/time is not provided
      }

      // Validate that start date/time is before end date/time
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      return startDateTime < endDateTime;
    },
    {
      message: 'End date and time must be after start date and time',
      path: ['endDate'], // This will attach the error to the endDate field
    },
  )
  .refine(
    (data) => {
      // If location type is virtual, locationLink should be provided
      if (
        data.locationType === 'virtual' &&
        (!data.locationLink || data.locationLink === '')
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Location link is required for virtual events',
      path: ['locationLink'],
    },
  );

export type SubmitEventInput = z.infer<typeof submitEventSchema>;

// Export the enum types for use in other parts of your application
export type EventType = z.infer<typeof EventTypeEnum>;
export type EventCategory = z.infer<typeof EventCategoryEnum>;
export type LocationType = z.infer<typeof LocationTypeEnum>;
export type Priority = z.infer<typeof PriorityEnum>;
export type Recurrence = z.infer<typeof RecurrenceEnum>;
