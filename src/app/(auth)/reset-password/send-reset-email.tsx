'use client';

import { SubmitButton } from '@/components/ui/submit-button';
import { sendPasswordResetLink } from '@/lib/auth/actions';
import { Paths } from '@/lib/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SendResetEmail() {
  const [state, formAction] = useActionState(sendPasswordResetLink, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success('A password reset link has been sent to your email.');
      router.push(Paths.Login);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error, state?.success, router]);

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="mb-4 space-y-6" action={formAction}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Your email
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              autoComplete="email"
              className="focus:ring-primaryColor block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6"
            />
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
      <div className="mb-4">
        <Link
          href="/"
          className="bg-primaryColor/10 hover:bg-primaryColor/50 focus-visible:outline-primaryColor/10 flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 shadow-sm focus-visible:outline focus-visible:outline-offset-2"
        >
          Cancel
        </Link>
      </div>
      <div>
        <p className="mt-10 inline text-center text-sm/6 text-gray-500">
          Not signed up?{' '}
        </p>
        <Link
          href="/sign-up"
          className="text-primaryColor hover:text-primaryColor/70 inline font-semibold"
        >
          Sign up now.
        </Link>
      </div>
    </div>
  );
}
