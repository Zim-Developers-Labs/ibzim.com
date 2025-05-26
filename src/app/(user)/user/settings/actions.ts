'use server';

import {
  ChangeEmailInput,
  changeEmailSchema,
  ChangePasswordInput,
  changePasswordSchema,
  FullNameInput,
  fullNameSchema,
  PhoneNumberInput,
  phoneNumberSchema,
  UsernameInput,
  usernameSchema,
} from '@/lib/validators/settings';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  CountryCode,
} from 'libphonenumber-js';
import { UserCommunicationSettings } from './communications/com-elements';
import { Scrypt } from 'lucia';
import { generateEmailVerificationCode } from '@/lib/auth/actions';
import { EmailTemplate, sendMail } from '@/lib/email';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';
import { lucia } from '@/lib/auth';
import { validateRequest } from '@/lib/auth/validate-request';
import { cookies } from 'next/headers';

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  done?: boolean;
}

export async function updateAvatarUrl(avatarUrl: string, userId: string) {
  if (avatarUrl != '') {
    await db
      .update(users)
      .set({ avatar: avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, userId));
  } else {
    throw new Error('Failed to update avatar url');
  }
}

export async function updateFullName(
  _: any,
  formData: FormData,
): Promise<ActionResponse<FullNameInput>> {
  const obj = Object.fromEntries(formData.entries());

  const userId = String(formData.get('userId'));

  const parsed = fullNameSchema.safeParse(obj);
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
    .update(users)
    .set({ fullName: name, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return {
    done: true,
  };
}

export async function updateUsername(
  _: any,
  formData: FormData,
): Promise<ActionResponse<UsernameInput>> {
  const obj = Object.fromEntries(formData.entries());

  const userId = String(formData.get('userId'));

  const parsed = usernameSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        username: err.fieldErrors.username?.[0],
      },
    };
  }

  const { username } = parsed.data;

  const existingUsername = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, username),
    columns: { username: true },
  });

  if (existingUsername) {
    return {
      fieldError: {
        username: 'Username already taken',
      },
    };
  }

  await db
    .update(users)
    .set({ username, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return {
    done: true,
  };
}

export async function updatePhoneNumber(
  _: any,
  formData: FormData,
): Promise<ActionResponse<PhoneNumberInput>> {
  const obj = Object.fromEntries(formData.entries());

  const userId = String(formData.get('userId'));
  const dialCode = String(formData.get('dialCode'));

  const parsed = phoneNumberSchema.safeParse(obj);
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

  // Parse the phone number with the selected country code
  let parsedNumber;
  try {
    // Remove the '+' sign and convert to uppercase to match CountryCode format
    const countryCode = dialCode.replace('+', '').toUpperCase() as CountryCode;
    parsedNumber = parsePhoneNumber(cleanedNumber, countryCode);
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

  // Format the phone number to E.164 format (with country code)
  const formattedNumber = parsedNumber.format('E.164');

  // Check for existing phone numbers in both formats
  const existingPhoneNumber = await db.query.users.findFirst({
    where: (table, { or, eq }) =>
      or(
        eq(table.phoneNumber, formattedNumber),
        eq(table.phoneNumber, cleanedNumber),
      ),
    columns: { username: true },
  });

  if (existingPhoneNumber) {
    return {
      fieldError: {
        phoneNumber: 'Phone number already in use',
      },
    };
  }

  // Store the formatted number (with country code) in the database
  await db
    .update(users)
    .set({ phoneNumber: formattedNumber, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return {
    done: true,
  };
}

export async function updateLocation(
  _: any,
  formData: FormData,
): Promise<{ error?: string; done?: boolean } | void> {
  const userId = String(formData.get('userId'));
  const country = String(formData.get('country'));
  const city = String(formData.get('city')) || null;

  await db
    .update(users)
    .set({ country, city, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return {
    done: true,
  };
}

export async function updateUserCommunicationSettings(
  userId: string,
  newSettings: Partial<UserCommunicationSettings>,
) {
  await db
    .update(users)
    .set({
      communicationSettings: newSettings,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function changeEmail(
  _: any,
  formData: FormData,
): Promise<ActionResponse<ChangeEmailInput>> {
  const parsed = changeEmailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        newEmail: err.fieldErrors.newEmail?.[0],
        confirmNewEmail: err.fieldErrors.confirmNewEmail?.[0],
        currentPassword: err.fieldErrors.currentPassword?.[0],
      },
    };
  }

  const { userId, newEmail, confirmNewEmail, currentPassword } = parsed.data;

  if (newEmail !== confirmNewEmail) {
    return {
      fieldError: {
        confirmNewEmail: 'Emails do not match',
      },
    };
  }

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  if (user?.githubId || user?.githubId) {
    return {
      fieldError: {
        currentEmail: 'Disconnect Google/Github Account first to use password.',
      },
    };
  }

  if (!user?.hashedPassword) {
    return {
      fieldError: {
        currentPassword:
          'You are currently using social login, password not set.',
      },
    };
  }

  const validPassword = await new Scrypt().verify(
    user.hashedPassword,
    currentPassword,
  );

  if (!validPassword) {
    return {
      fieldError: {
        currentPassword: 'Incorrect password',
      },
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, newEmail),
    columns: { email: true },
  });

  if (existingUser) {
    return {
      fieldError: {
        newEmail: 'Email already in use.',
      },
    };
  }

  await db
    .update(users)
    .set({ email: newEmail, emailVerified: false })
    .where(eq(users.id, userId));

  // Send verification email to new email address
  const verificationCode = await generateEmailVerificationCode(
    userId,
    newEmail,
  );
  await sendMail(newEmail, EmailTemplate.EmailVerification, {
    code: verificationCode,
  });

  return {
    done: true,
  };
}

export async function changePassword(
  _: any,
  formData: FormData,
): Promise<ActionResponse<ChangePasswordInput>> {
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        newPassword: err.fieldErrors.newPassword?.[0],
        confirmNewPassword: err.fieldErrors.confirmNewPassword?.[0],
      },
    };
  }

  const { userId, currentPassword, newPassword, confirmNewPassword } =
    parsed.data;

  if (newPassword !== confirmNewPassword) {
    return {
      fieldError: {
        confirmNewPassword: 'Passwords do not match',
      },
    };
  }

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  if (user?.hashedPassword == null) {
  } else {
    const validPassword = await new Scrypt().verify(
      user.hashedPassword,
      currentPassword,
    );

    if (!validPassword) {
      return {
        fieldError: {
          currentPassword: 'Incorrect password',
        },
      };
    }
  }

  const hashedPassword = await new Scrypt().hash(newPassword);
  await db.update(users).set({ hashedPassword }).where(eq(users.id, userId));

  const { session } = await validateRequest();
  if (!session) {
    return {
      fieldError: {
        userId: 'No session found',
      },
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect(Paths.Login);
}

export async function deleteAccount() {}

export async function disconnectGoogleAccount() {}
