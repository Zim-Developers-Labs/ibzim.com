'use server';

import { db } from './db';

export async function checkPhoneNumberAvailability(
  e164Number: string,
): Promise<boolean> {
  const existingPhoneNumber = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.phoneNumber, e164Number),
    columns: { username: true },
  });

  if (existingPhoneNumber) {
    return false;
  }

  return true;
}
