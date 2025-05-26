'use client';

import { SubmitButton } from '@/components/ui/submit-button';
import { getEmailVerificationCode } from '@/lib/auth/actions';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export function VerifyEmailBanner({
  email,
  userId,
}: {
  userId: string;
  email: string;
}) {
  const [state, formAction] = useActionState(getEmailVerificationCode, null);

  useEffect(() => {
    if (state?.error) {
      console.error(state.error);
      toast.error(state.error);
    }
    if (state?.success) {
      console.log('Email verification code sent successfully');
      toast.success('Verification email sent successfully');
      state.success = false; // Reset the done state
    }
  });

  return (
    <form
      action={formAction}
      className="w-full border-b border-yellow-200 bg-yellow-50 p-4"
    >
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="userId" value={userId} />
      <div className="mx-auto flex w-fit items-center gap-4">
        <div className="">
          <InformationCircleIcon
            aria-hidden="true"
            className="h-5 w-5 text-yellow-400"
          />
        </div>
        <p className="text-sm text-yellow-700">Email Verification Pending</p>
        <SubmitButton className="rounded-sm bg-yellow-100 p-2 whitespace-nowrap text-yellow-700 hover:text-yellow-600">
          Verify Now
        </SubmitButton>
      </div>
    </form>
  );
}

export function CompleteProfileBanner() {
  return (
    <div className="w-full bg-yellow-50 p-4">
      <div className="mx-auto flex w-fit items-center gap-4">
        <div className="">
          <InformationCircleIcon
            aria-hidden="true"
            className="h-5 w-5 text-yellow-400"
          />
        </div>
        <p className="text-sm text-yellow-700">Most IBZim features disabled</p>
        <Link
          href="/auth/onboarding"
          className="rounded-sm bg-yellow-100 p-2 text-sm whitespace-nowrap text-yellow-700 hover:bg-yellow-200"
        >
          Complete Profile
        </Link>
      </div>
    </div>
  );
}
