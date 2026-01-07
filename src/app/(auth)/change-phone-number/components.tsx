import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@/lib/server/constants';
import ChangeEmailForm from './forms';
import ChangePhoneNumberForm from './forms';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function ChangePhoneNumberComponents({
  user,
  callbackUrl,
}: {
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
              {user.phoneNumber ? 'Change' : 'Add'} your phone number
            </CardTitle>
            <CardDescription className="leading-relaxed text-gray-600">
              You are {user.phoneNumber ? 'changing the' : 'adding a'} phone
              number for {user.phoneNumber ?? user.fullName.split(' ')[0]}.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mx-auto mb-4 flex max-w-[300px] items-center justify-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-1.5 py-2 text-center text-sm text-yellow-700">
            <Info className="inline-block h-4 w-4 text-yellow-700" />
            <span className="text-sm">
              Feature not ready.{' '}
              <Link className="font-medium underline" href={callbackUrl ?? '/'}>
                Back to site
              </Link>
            </span>
          </div>
          <ChangePhoneNumberForm callbackUrl={callbackUrl} user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
