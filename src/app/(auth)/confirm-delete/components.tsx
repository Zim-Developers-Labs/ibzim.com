import Link from 'next/link';
import {
  EmailVerificationForm,
  ResendEmailVerificationCodeForm,
} from './forms';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { EmailVerificationRequest, User } from '@/lib/server/constants';
import { ExternalLink } from 'lucide-react';

export default function VerifyEmailComponents({
  verificationRequest,
  user,
  callbackUrl,
}: {
  verificationRequest: EmailVerificationRequest | null;
  user: User;
  callbackUrl?: string;
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
              Confirm Account Deletion
            </CardTitle>
            <CardDescription className="leading-relaxed text-gray-600">
              We&#39;ve sent an 8-digit code to{' '}
              <span className="font-medium text-gray-900">
                {' '}
                {verificationRequest?.email ?? user.email}.
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmailVerificationForm callbackUrl={callbackUrl} user={user} />
          <ResendEmailVerificationCodeForm />

          <div className="border-t border-gray-100 pt-4 text-center">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Need help?{' '}
              <Link
                href="https://wa.me/+263717238876"
                target="_blank"
                rel="nofollow"
                className="text-foreground hover:underline"
              >
                Contact&nbsp;Support
                <ExternalLink className="ml-1 inline size-3" />
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
