'use server';

import { db } from './db';

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    columns: { email: true },
  });

  if (existingUser) {
    return false;
  }

  return true;
}
