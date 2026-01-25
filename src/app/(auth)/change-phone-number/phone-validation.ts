import { parsePhoneNumber, type CountryCode } from 'libphonenumber-js';

export interface PhoneValidationResult {
  isValid: boolean;
  e164Format?: string; // +263780105064 - for storage and SMS
  nationalFormat?: string; // 078 010 5064 - for display
  internationalFormat?: string; // +263 78 010 5064 - for display
  countryCode?: CountryCode;
  error?: string;
}

/**
 * Validates and formats a phone number for a given country.
 * Returns all common formats for storage and display.
 *
 * @param phoneNumber - Raw phone number input (can include spaces, dashes, parentheses)
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'US', 'ZW', 'GB')
 * @returns PhoneValidationResult with formatted numbers or error
 */
export function validatePhoneNumber(
  phoneNumber: string,
  countryCode: CountryCode,
): PhoneValidationResult {
  try {
    // Clean the input - remove spaces, dashes, parentheses
    const cleanedNumber = phoneNumber.replace(/[\s\-()]/g, '');

    if (!cleanedNumber) {
      return {
        isValid: false,
        error: 'Phone number is required',
      };
    }

    // Parse and validate with libphonenumber-js
    const parsed = parsePhoneNumber(cleanedNumber, countryCode);

    if (!parsed || !parsed.isValid()) {
      return {
        isValid: false,
        error: `Invalid phone number for ${countryCode}`,
      };
    }

    return {
      isValid: true,
      e164Format: parsed.format('E.164'), // +263780105064
      nationalFormat: parsed.formatNational(), // 078 010 5064
      internationalFormat: parsed.formatInternational(), // +263 78 010 5064
      countryCode: parsed.country,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid phone number',
    };
  }
}

/**
 * Formats a stored E.164 phone number for display
 *
 * @param e164Number - Phone number in E.164 format (e.g., '+263780105064')
 * @param format - Desired format ('national' | 'international')
 * @returns Formatted phone number or original if parsing fails
 */
export function formatPhoneNumber(
  e164Number: string,
  format: 'national' | 'international' = 'international',
): string {
  try {
    const parsed = parsePhoneNumber(e164Number);
    if (!parsed) return e164Number;

    return format === 'national'
      ? parsed.formatNational()
      : parsed.formatInternational();
  } catch {
    return e164Number;
  }
}
