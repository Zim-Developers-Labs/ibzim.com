'use server';

import { sendVerificationTextBucket } from '@/lib/server/constants';
import { checkPhoneNumberAvailability } from '@/lib/server/phone-number';
import {
  createPhoneNumberVerificationRequest,
  sendVerificationText,
  setPhoneNumberVerificationRequestCookie,
} from '@/lib/server/phone-number-verification';
import { globalPOSTRateLimit } from '@/lib/server/request';
import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import {
  validatedPhoneNumberSchema,
  type PhoneNumberInput,
} from './validators';
import { validatePhoneNumber } from './phone-validation';
import type { CountryCode } from 'libphonenumber-js';

export async function updatePhoneNumberAction(
  _: any,
  formData: FormData,
): Promise<ActionResult<PhoneNumberInput>> {
  if (!globalPOSTRateLimit()) {
    return {
      formError: 'Too many requests',
    };
  }

  const { session, user } = await getCurrentSession();
  if (session === null) {
    return {
      formError: 'Not authenticated',
    };
  }

  if (user.registered2FA && !session.twoFactorVerified) {
    return {
      formError: 'Forbidden',
    };
  }

  if (!sendVerificationTextBucket.check(user.id, 1)) {
    return {
      formError: 'Too many requests',
    };
  }

  const obj = Object.fromEntries(formData.entries());
  const parsed = validatedPhoneNumberSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        phoneNumber: err.fieldErrors.phoneNumber?.[0],
      },
    };
  }

  const { phoneNumber, countryCode } = parsed.data;
  const callbackUrl = formData.get('callbackUrl')?.toString();

  const validationResult = validatePhoneNumber(
    phoneNumber,
    countryCode as CountryCode,
  );

  if (!validationResult.isValid || !validationResult.e164Format) {
    return {
      fieldError: {
        phoneNumber: validationResult.error || 'Invalid phone number',
      },
    };
  }

  const e164Number = validationResult.e164Format;

  const phoneNumberAvailable = await checkPhoneNumberAvailability(e164Number);

  if (!phoneNumberAvailable) {
    return {
      fieldError: {
        phoneNumber: 'This phone number is already in use',
      },
    };
  }

  if (!sendVerificationTextBucket.consume(user.id, 1)) {
    return {
      formError: 'Too many requests',
    };
  }

  const verificationRequest = await createPhoneNumberVerificationRequest(
    user.id,
    e164Number,
  );

  await sendVerificationText(
    verificationRequest.phoneNumber,
    verificationRequest.code,
  );

  await setPhoneNumberVerificationRequestCookie(verificationRequest);

  return redirect(
    callbackUrl
      ? `/verify-phone-number?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/verify-phone-number',
  );
}

interface ActionResult<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  error?: string;
  done?: boolean;
}
