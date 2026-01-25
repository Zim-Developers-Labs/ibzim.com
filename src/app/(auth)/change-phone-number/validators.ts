import z from 'zod';
import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js';

// Custom Zod validator that uses libphonenumber-js
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .transform((val) => val.replace(/[\s\-()]/g, '')), // Clean input
  countryCode: z.string().length(2, 'Country code is required'),
  verificationMethod: z.enum(['sms', 'whatsapp']).default('whatsapp'),
});

// Refined schema that validates the phone number with libphonenumber-js
export const validatedPhoneNumberSchema = phoneNumberSchema.superRefine(
  (data, ctx) => {
    try {
      const parsed = parsePhoneNumber(
        data.phoneNumber,
        data.countryCode as CountryCode,
      );

      if (!parsed || !parsed.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid phone number for ${data.countryCode}`,
          path: ['phoneNumber'],
        });
      }
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid phone number format',
        path: ['phoneNumber'],
      });
    }
  },
);

export type PhoneNumberInput = z.infer<typeof phoneNumberSchema>;
export type ValidatedPhoneNumberInput = z.infer<
  typeof validatedPhoneNumberSchema
>;
