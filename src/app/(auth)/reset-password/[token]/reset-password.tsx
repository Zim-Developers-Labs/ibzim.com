'use client';

import { SubmitButton } from '@/components/ui/submit-button';
import { resetPassword } from '@/lib/auth/actions';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ResetPasswordWrapper({
  token,
}: {
  token: string;
  callbackUrl?: string;
}) {
  const [state, formAction] = useActionState(resetPassword, null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.error) {
      console.log(state?.error);
      toast.error(state.error);
    }
  }, [state?.error]);

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="mb-4 space-y-6" action={formAction}>
        <input type="hidden" name="token" value={token} />
        <div>
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            New Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="*****"
              autoComplete="new-password"
              className="focus:ring-primaryColor block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6"
            />
            <div
              className="absolute top-0 right-0 cursor-pointer pt-2 pr-4"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </div>
          </div>
        </div>

        <div>
          <SubmitButton
            type="submit"
            className="bg-primaryColor hover:bg-primaryColor/70 focus-visible:outline-primaryColor flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2"
          >
            Reset Password
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
