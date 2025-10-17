import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { ExpiringTokenBucket, RefillingTokenBucket } from './rate-limit';

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(
  3,
  60 * 10,
);

export const sendVerificationTextBucket = new ExpiringTokenBucket<number>(
  3,
  60 * 10,
);

export interface EmailVerificationRequest {
  id: string;
  userId: number;
  code: string;
  email: string;
  expiresAt: Date;
}

export interface PhoneNumberVerificationRequest {
  id: string;
  userId: number;
  code: string;
  phoneNumber: string;
  expiresAt: Date;
}

export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
  return token;
}

export function sendPasswordResetEmail(email: string, code: string): void {
  console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
  id: string;
  userId: number;
  email: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
  twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };

export const globalBucket = new RefillingTokenBucket<string>(100, 1);

export interface SessionFlags {
  twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
  id: string;
  expiresAt: Date;
  userId: number;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export function verifyUsernameInput(username: string): boolean {
  return (
    username.length > 3 && username.length < 32 && username.trim() === username
  );
}

export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  emailVerified: boolean;
  registered2FA: boolean;
  accessLevel: number;
  ip: number;
  googleId?: string | null;
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean;
  avatar?: string | null;
}
