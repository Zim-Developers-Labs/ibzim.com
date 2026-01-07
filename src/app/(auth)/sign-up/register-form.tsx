'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { signupAction } from './actions';
import { Icons } from '@/components/icons';
import { EyeIcon, EyeOffIcon, Info, Check, X } from 'lucide-react';
import { SubmitButton } from '@/components/ui/submit-button';
import { DOMAIN_URLS } from '@/lib/constants';

const initialState = {
  message: '',
};

export function RegisterForm({
  className,
  callbackUrl,
  error,
  ...props
}: React.ComponentProps<'form'> & { callbackUrl?: string; error?: string }) {
  const [state, action] = useActionState(signupAction, initialState);

  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = (index: number) => {
    if (passwordStrength >= index + 1) {
      if (passwordStrength === 1) return 'bg-red-500';
      if (passwordStrength === 2) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    return 'bg-gray-200';
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      action={action}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm/6 text-gray-500">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = callbackUrl
                ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : '/sign-in';
            }}
            className="text-primaryColor hover:text-primaryColor/70 font-semibold"
          >
            Login now
          </Link>
        </p>
        <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-1.5 py-2 text-center text-sm text-yellow-700">
          <Info className="inline-block h-4 w-4 text-yellow-700" />
          <span className="text-sm">
            Data may reset occasionally during beta.
          </span>
        </div>
      </div>
      <div className="grid gap-6">
        {error && (
          <p className="rounded-sm bg-red-100 p-2 text-sm text-red-500">
            Email already exists, use a different google account or login.
          </p>
        )}
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = callbackUrl
              ? `/sign-up/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : '/sign-up/google';
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
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
          Use Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowEmail((prev) => !prev)}
        >
          <Icons.envelopIconSolid className="mr-2 size-5" />
          Use Email
        </Button>
        <div className={`mt-10 ${!showEmail ? 'hidden' : 'block'} space-y-6`}>
          <div className="grid gap-3">
            <Label htmlFor="form-signup.fname">First Name</Label>
            <Input id="form-signup.fname" name="fname" type="text" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="form-signup.lname">Last Name</Label>
            <Input id="form-signup.lname" name="lname" type="text" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="form-signup.email">Email</Label>
            <Input
              id="form-signup.email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="form-signup.password">Password</Label>
              <div
                className="mr-2 ml-auto cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <div className="flex items-center gap-1 text-xs">
                    <EyeOffIcon className="size-4" />
                    Hide
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs">
                    <EyeIcon className="size-4" />
                    Show
                  </div>
                )}
              </div>
            </div>
            <Input
              id="form-signup.password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <div className="mt-2 flex space-x-1">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`h-1 w-1/4 rounded-full transition-all duration-300 ${getStrengthColor(index)}`}
                />
              ))}
            </div>
            {password !== '' && (
              <p className="mt-1 text-sm text-gray-500">
                {passwordStrength < 2 && 'Password is too weak'}
                {passwordStrength === 2 && 'Password strength is moderate'}
                {passwordStrength > 2 && 'Password is strong'}
              </p>
            )}
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                {password.length >= 8 ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-gray-400" />
                )}
                <span
                  className={
                    password.length >= 8 ? 'text-green-600' : 'text-gray-500'
                  }
                >
                  At least 8 characters
                </span>
              </li>
              <li className="flex items-center gap-2">
                {/[a-z]/.test(password) ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-gray-400" />
                )}
                <span
                  className={
                    /[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'
                  }
                >
                  One lowercase letter (a-z)
                </span>
              </li>
              <li className="flex items-center gap-2">
                {/[A-Z]/.test(password) ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-gray-400" />
                )}
                <span
                  className={
                    /[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'
                  }
                >
                  One uppercase letter (A-Z)
                </span>
              </li>
              <li className="flex items-center gap-2">
                {/\d/.test(password) ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-gray-400" />
                )}
                <span
                  className={
                    /\d/.test(password) ? 'text-green-600' : 'text-gray-500'
                  }
                >
                  One number (0-9)
                </span>
              </li>
              <li className="flex items-center gap-2">
                {/[^a-zA-Z\d]/.test(password) ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X className="size-4 text-gray-400" />
                )}
                <span
                  className={
                    /[^a-zA-Z\d]/.test(password)
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }
                >
                  One special character (e.g. !@#$%^&*)
                </span>
              </li>
            </ul>
          </div>
          {state.message && (
            <p className="rounded-sm bg-red-100 p-2 text-sm text-red-500">
              {state.message}
            </p>
          )}
          <SubmitButton className="w-full">Continue</SubmitButton>
        </div>
      </div>
      <div className="mt-6 w-full border-t border-gray-200" />

      <p className="text-sm text-gray-600">
        By continuing, you confirm you are 16 or over and agree to our{' '}
        <Link href={`/policies/privacy`} className="underline">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link href={`/policies/terms`} className="underline">
          Terms of Use
        </Link>
        .
      </p>
    </form>
  );
}
