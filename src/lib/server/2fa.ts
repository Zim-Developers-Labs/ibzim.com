'use server';

import { and, eq } from 'drizzle-orm';
import { generateRandomRecoveryCode } from '../utils';
import { db } from './db';
import { decryptToString, encryptString } from './encryption';
import { sessions, users } from './db/schema';

export async function resetUser2FAWithRecoveryCode(
  userId: number,
  recoveryCode: string,
): Promise<boolean> {
  // Note: In Postgres and MySQL, these queries should be done in a transaction using SELECT FOR UPDATE
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      recoveryCode: true,
    },
  });

  if (!user || !user.recoveryCode) {
    return false;
  }

  const userRecoveryCode = decryptToString(
    Buffer.from(user.recoveryCode, 'base64'),
  );
  if (recoveryCode !== userRecoveryCode) {
    return false;
  }

  const newRecoveryCode = generateRandomRecoveryCode();
  const encryptedNewRecoveryCode = encryptString(newRecoveryCode);

  await db
    .update(sessions)
    .set({ twoFactorVerified: false })
    .where(eq(sessions.userId, userId));

  const result = await db
    .update(users)
    .set({
      recoveryCode: Buffer.from(encryptedNewRecoveryCode).toString('base64'),
      totpKey: null,
    })
    .where(and(eq(users.id, userId), eq(users.recoveryCode, userRecoveryCode)));

  return result.rowCount > 0;
}
