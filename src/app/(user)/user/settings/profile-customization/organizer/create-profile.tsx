'use client';

import { UserPlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionState, useEffect } from 'react';
import { createOrganizerProfile } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CreateProfile({ userId }: { userId: string }) {
  const router = useRouter();
  const [createProfileState, createProfileFormAction] = useActionState(
    createOrganizerProfile,
    null,
  );

  useEffect(() => {
    if (createProfileState?.fieldError) {
      Object.values(createProfileState.fieldError).forEach((error) => {
        toast.error(error);
      });
    } else if (createProfileState?.formError) {
      toast.error(createProfileState.formError);
    } else if (createProfileState?.done) {
      toast.success('Profile Created Successfully');
      createProfileState.done = false;
      router.push('/user/settings/profile-customization/organizer');
    }
  }, [createProfileState, router]);

  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-zinc-200 bg-zinc-50 shadow-none">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50">
            <UserPlus className="text-primary h-8 w-8" strokeWidth={1} />
          </div>
          <CardTitle className="text-xl font-normal">
            Create Your Organizer Profile
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            You need to set up your organizer profile to start creating and
            managing events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProfileFormAction} className="space-y-4">
            <input type="hidden" value={userId} name="userId" />
            <div className="grid place-content-center">
              <SubmitButton className="w-fit px-4 py-2">
                Create Organizer Profile
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
