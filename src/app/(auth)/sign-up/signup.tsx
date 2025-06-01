'use client';

import Link from 'next/link';
import { signup } from '@/lib/auth/actions';
import { SubmitButton } from '@/components/ui/submit-button';
import { useActionState, useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import Image from 'next/image';

export default function SignUpLayout({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  const [state, formAction] = useActionState(signup, null);

  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);

    if (state?.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    }
    if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state, password]);

  const getStrengthColor = (index: number) => {
    if (passwordStrength >= index + 1) {
      if (passwordStrength === 1) return 'bg-red-500';
      if (passwordStrength === 2) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    return 'bg-gray-200';
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-row-reverse md:h-screen">
        <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:flex-none lg:px-20 xl:px-48">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Icons.logo className="h-10 w-fit lg:hidden" />
              <h2 className="mt-4 text-2xl/9 font-bold tracking-tight text-gray-900">
                Register new account
              </h2>
              <p className="mt-1 text-sm/6 text-gray-500">
                Already have an account?{' '}
                <Link
                  href="/sign-in"
                  className="text-primaryColor hover:text-primaryColor/70 font-semibold"
                >
                  Login now
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <div>
                <form action={formAction} className="space-y-6">
                  <input
                    type="hidden"
                    name="callbackUrl"
                    value={callbackUrl || '/'}
                  />
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="focus:ring-primaryColor block w-full rounded-sm border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="focus:ring-primaryColor block w-full rounded-md border-0 px-4 py-1.5 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:ring-primaryColor block w-full rounded-md border-0 px-4 py-1.5 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6"
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
                    <div className="mt-2 flex space-x-1">
                      {[0, 1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className={`h-1 w-1/4 rounded-full transition-all duration-300 ${getStrengthColor(index)}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {passwordStrength < 2 && 'Password is too weak'}
                      {passwordStrength === 2 &&
                        'Password strength is moderate'}
                      {passwordStrength > 2 && 'Password is strong'}
                    </p>
                  </div>
                  <div>
                    <SubmitButton
                      disabled={passwordStrength < 3}
                      type="submit"
                      className="bg-primaryColor hover:bg-primaryColor/70 focus-visible:outline-primaryColor flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2"
                    >
                      Sign up
                    </SubmitButton>
                  </div>
                </form>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm/6 font-medium">
                    <span className="bg-white px-6 text-sm text-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Link
                    href={`/sign-in/google?callbackUrl=${encodeURIComponent(callbackUrl || '/')}`}
                    prefetch={false}
                    className="col-span-2 flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span className="text-sm/6 font-semibold">Google</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            alt="Zimbabwe Cyber City"
            src="/assets/zimbabwe/cyber-city.webp"
            className="absolute inset-0 h-full w-full object-cover"
            fill
          />
        </div>
      </div>
    </>
  );
}
