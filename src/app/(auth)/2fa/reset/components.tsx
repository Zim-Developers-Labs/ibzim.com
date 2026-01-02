import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TwoFactorResetForm } from './forms';
import { Icons } from '@/components/icons';

export default function FAResetComponent({
  callbackUrl,
}: {
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
              Recover your account
            </CardTitle>
            <CardDescription className="leading-relaxed text-gray-600">
              Enter your recovery code to reset your 2FA settings
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <TwoFactorResetForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
