'use server';

import { db } from '@/server/db';
import { OrganizerProfile, organizerProfiles, users } from '@/server/db/schema';
import { generateId } from 'lucia';
import {
  CallsNumberInput,
  callsNumberSchema,
  CreateAccountInput,
  EmailInput,
  emailSchema,
  NameInput,
  nameSchema,
  WhatsappNumberInput,
  whatsappNumberSchema,
} from './validators';
import { eq } from 'drizzle-orm';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  done?: boolean;
}

export async function createOrganizerProfile(
  _: any,
  formData: FormData,
): Promise<ActionResponse<CreateAccountInput>> {
  const userId = formData.get('userId') as string;

  const existingUser = await db.query.organizerProfiles.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
    columns: { name: true },
  });

  if (existingUser) {
    return {
      formError: 'User already has an organizer profile',
    };
  }

  const organizerId = generateId(21);

  await db.insert(organizerProfiles).values({
    id: organizerId,
    userId: userId,
  });

  await db
    .update(users)
    .set({ organizerProfileCreated: true })
    .where(eq(users.id, userId));

  return {
    done: true,
  };
}

export async function getOrganizerProfile(
  userId: string,
): Promise<OrganizerProfile> {
  const organizers = await db
    .select()
    .from(organizerProfiles)
    .where(eq(organizerProfiles.userId, userId));

  return organizers[0];
}

export async function updateOrganizerName(
  _: any,
  formData: FormData,
): Promise<ActionResponse<NameInput>> {
  const obj = Object.fromEntries(formData.entries());

  const organizerId = String(formData.get('organizerId'));

  const parsed = nameSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();

    return {
      fieldError: {
        name: err.fieldErrors.name?.[0],
      },
    };
  }

  const { name } = parsed.data;

  await db
    .update(organizerProfiles)
    .set({ name, updatedAt: new Date() })
    .where(eq(organizerProfiles.id, organizerId));

  return {
    done: true,
  };
}

export async function updateOrganizerEmail(
  _: any,
  formData: FormData,
): Promise<ActionResponse<EmailInput>> {
  const obj = Object.fromEntries(formData.entries());

  const organizerId = String(formData.get('organizerId'));

  const parsed = emailSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();

    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
      },
    };
  }

  const { email } = parsed.data;

  await db
    .update(organizerProfiles)
    .set({ email, updatedAt: new Date() })
    .where(eq(organizerProfiles.id, organizerId));

  return {
    done: true,
  };
}

export async function updateOrganizerWhatsappNumber(
  _: any,
  formData: FormData,
): Promise<ActionResponse<WhatsappNumberInput>> {
  const obj = Object.fromEntries(formData.entries());

  const organizerId = String(formData.get('organizerId'));

  const parsed = whatsappNumberSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();

    return {
      fieldError: {
        phoneNumber: err.fieldErrors.phoneNumber?.[0],
      },
    };
  }

  const { phoneNumber } = parsed.data;
  const cleanedNumber = phoneNumber.replace(/\s+/g, '');
  let parsedNumber;

  try {
    parsedNumber = parsePhoneNumber(cleanedNumber);
    if (!parsedNumber || !isValidPhoneNumber(parsedNumber.number)) {
      return {
        fieldError: {
          phoneNumber: 'Invalid phone number',
        },
      };
    }
  } catch (error) {
    return {
      fieldError: {
        phoneNumber: `Invalid phone number: ${error}`,
      },
    };
  }
  const formattedNumber = parsedNumber.format('E.164');

  const existingPhoneNumber = await db.query.organizerProfiles.findFirst({
    where: (table, { or, eq }) =>
      or(
        eq(table.whatsappPhoneNumber, formattedNumber),
        eq(table.whatsappPhoneNumber, cleanedNumber),
      ),
    columns: { name: true },
  });

  if (existingPhoneNumber) {
    return {
      fieldError: {
        phoneNumber: 'Phone number already in use',
      },
    };
  }

  await db
    .update(organizerProfiles)
    .set({ whatsappPhoneNumber: formattedNumber, updatedAt: new Date() })
    .where(eq(organizerProfiles.id, organizerId));

  return {
    done: true,
  };
}

export async function updateOrganizerCallsNumber(
  _: any,
  formData: FormData,
): Promise<ActionResponse<CallsNumberInput>> {
  const obj = Object.fromEntries(formData.entries());

  const organizerId = String(formData.get('organizerId'));

  const parsed = callsNumberSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();

    return {
      fieldError: {
        phoneNumber: err.fieldErrors.phoneNumber?.[0],
      },
    };
  }

  const { phoneNumber } = parsed.data;
  const cleanedNumber = phoneNumber.replace(/\s+/g, '');

  const existingNumber = await db.query.organizerProfiles.findFirst({
    where: (table, { eq }) => eq(table.callsPhoneNumber, cleanedNumber),
    columns: { name: true },
  });

  if (existingNumber) {
    return {
      fieldError: {
        phoneNumber: 'Phone number already in use',
      },
    };
  }

  await db
    .update(organizerProfiles)
    .set({ callsPhoneNumber: cleanedNumber, updatedAt: new Date() })
    .where(eq(organizerProfiles.id, organizerId));

  return {
    done: true,
  };
}
