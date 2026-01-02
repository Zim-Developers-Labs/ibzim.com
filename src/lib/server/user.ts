'use server';

import { db } from './db';
import { decrypt, decryptToString, encrypt, encryptString } from './encryption';
import { hashPassword } from './password';
import {
  convertToSlug,
  generateId,
  generateRandomRecoveryCode,
} from '../utils';
import { and, eq } from 'drizzle-orm';
import { users } from './db/schema';
import { User } from './constants';

export async function createUser(
  email: string,
  fullName: string,
  password: string,
): Promise<User> {
  const passwordHash = await hashPassword(password);
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);

  const usernameSuffix = generateId(6);
  const nameSlug = convertToSlug(fullName);

  const [dbUser] = await db
    .insert(users)
    .values({
      email,
      username: `${nameSlug}-${usernameSuffix}`,
      fullName,
      passwordHash,
      recoveryCode: Buffer.from(encryptedRecoveryCode).toString('base64'),
      accessLevel: 0,
      ip: 0,
    })
    .returning({
      id: users.id,
      email: users.email,
      username: users.username,
      emailVerified: users.emailVerified,
      fullName: users.fullName,
      accessLevel: users.accessLevel,
      ip: users.ip,
    });

  const user: User = {
    ...dbUser,
    registered2FA: false,
  };

  return user;
}

export async function createUserWithGoogle(
  googleId: string,
  email: string,
  fullName: string,
  avatar: string | null,
): Promise<User> {
  const usernameSuffix = generateId(6);
  const nameSlug = convertToSlug(fullName);
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);

  const [dbUser] = await db
    .insert(users)
    .values({
      email,
      username: `${nameSlug}-${usernameSuffix}`,
      fullName,
      googleId,
      emailVerified: true,
      recoveryCode: Buffer.from(encryptedRecoveryCode).toString('base64'),
      accessLevel: 0,
      avatar: avatar ?? null,
      ip: 0,
    })
    .returning({
      id: users.id,
      googleId: users.googleId,
      email: users.email,
      username: users.username,
      emailVerified: users.emailVerified,
      fullName: users.fullName,
      accessLevel: users.accessLevel,
      avatar: users.avatar,
      ip: users.ip,
    });

  const user: User = {
    ...dbUser,
    registered2FA: false,
  };

  return user;
}

export async function getUserFromGoogleId(
  googleId: string,
): Promise<User | null> {
  const dbUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.googleId, googleId),
    columns: {
      id: true,
      googleId: true,
      email: true,
      username: true,
      emailVerified: true,
      fullName: true,
      totpKey: true,
      accessLevel: true,
      avatar: true,
      ip: true,
    },
  });

  if (!dbUser) {
    return null;
  }

  const user: User = {
    id: dbUser.id,
    googleId: dbUser.googleId,
    email: dbUser.email,
    fullName: dbUser.fullName,
    username: dbUser.username,
    emailVerified: Boolean(dbUser.emailVerified),
    registered2FA: dbUser.totpKey !== null,
    accessLevel: dbUser.accessLevel,
    avatar: dbUser.avatar,
    ip: dbUser.ip,
  };
  return user;
}

export async function updateUserPassword(
  userId: number,
  password: string,
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

export async function updateUserEmailAndSetEmailAsVerified(
  userId: number,
  email: string,
): Promise<void> {
  await db
    .update(users)
    .set({
      email,
      emailVerified: true,
    })
    .where(eq(users.id, userId));
}

export async function updateUserPhoneNumberAndSetPhoneNumberAsVerified(
  userId: number,
  phoneNumber: string,
): Promise<void> {
  await db
    .update(users)
    .set({
      phoneNumber,
      phoneNumberVerified: true,
    })
    .where(eq(users.id, userId));
}

export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: number,
  email: string,
): Promise<boolean> {
  const result = await db
    .update(users)
    .set({ emailVerified: true })
    .where(and(eq(users.id, userId), eq(users.email, email)));

  return result.rowCount > 0;
}

export async function getUserPasswordHash(
  userId: number,
): Promise<string | null> {
  const user = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) {
    throw new Error('Invalid user ID');
  }
  return user[0].passwordHash;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
  const user = await db
    .select({ recoveryCode: users.recoveryCode })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) {
    throw new Error('Invalid user ID');
  }
  return decryptToString(Buffer.from(user[0].recoveryCode, 'base64'));
}

export async function getUserTOTPKey(
  userId: number,
): Promise<Uint8Array | null> {
  const user = await db
    .select({ totpKey: users.totpKey })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user[0]) {
    throw new Error('Invalid user ID');
  }

  if (user[0].totpKey === null) {
    return null;
  }
  return decrypt(Buffer.from(user[0].totpKey, 'base64'));
}

export async function updateUserTOTPKey(
  userId: number,
  key: Uint8Array,
): Promise<void> {
  const encrypted = encrypt(key);
  await db
    .update(users)
    .set({ totpKey: Buffer.from(encrypted).toString('base64') })
    .where(eq(users.id, userId));
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
  const recoveryCode = generateRandomRecoveryCode();
  const encrypted = encryptString(recoveryCode);
  await db
    .update(users)
    .set({ recoveryCode: Buffer.from(encrypted).toString('base64') })
    .where(eq(users.id, userId));
  return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    columns: {
      id: true,
      email: true,
      username: true,
      emailVerified: true,
      fullName: true,
      totpKey: true,
      accessLevel: true,
      ip: true,
    },
  });
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    emailVerified: Boolean(user.emailVerified),
    registered2FA: user.totpKey !== null,
    accessLevel: user.accessLevel,
    ip: user.ip,
  };
}
