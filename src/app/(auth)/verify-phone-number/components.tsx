import Link from 'next/link';
import {
  PhoneNumberVerificationForm,
  ResendPhoneNumberVerificationCodeForm,
} from './forms';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { PhoneNumberVerificationRequest, User } from '@/lib/server/constants';

export default function VerifyPhoneNumberComponents({
  verificationRequest,
  user,
  callbackUrl,
  countryCode,
  verificationMethod,
}: {
  verificationRequest: PhoneNumberVerificationRequest | null;
  user: User;
  callbackUrl?: string;
  countryCode: string;
  verificationMethod: 'sms' | 'whatsapp';
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md border border-zinc-200 bg-white shadow-none">
        <CardHeader className="space-y-4 pb-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
            <Icons.brandedShield className="h-10 w-10 text-zinc-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Phone Number Verification
            </CardTitle>
            <CardDescription className="leading-relaxed text-gray-600">
              We&#39;ve sent an 8-digit code to{' '}
              <span className="font-medium text-gray-900">
                {' '}
                {verificationRequest?.phoneNumber ?? user.phoneNumber}.
              </span>{' '}
              on Whatsapp.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <PhoneNumberVerificationForm
            callbackUrl={callbackUrl}
            countryCode={countryCode}
            verificationMethod={verificationMethod}
          />
          <ResendPhoneNumberVerificationCodeForm />

          <div className="border-t border-gray-100 pt-4 text-center">
            <Link
              href={`/change-phone-number${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`}
              className="text-center text-xs leading-relaxed text-gray-500"
            >
              Change your phone number
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
