'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { loginAction } from './actions';
import Link from 'next/link';
import { Info } from 'lucide-react';

const initialState = {
  message: '',
};

export function LoginForm({
  className,
  callbackUrl,
  error,
  ...props
}: React.ComponentProps<'form'> & { callbackUrl?: string; error?: string }) {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      action={action}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
        <div className="flex w-full items-center justify-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-1.5 py-2 text-center text-sm text-yellow-700">
          <Info className="inline-block h-4 w-4 text-yellow-700" />
          <span className="text-sm">
            Data may reset occasionally during beta.
          </span>
        </div>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="form-login.email">Email</Label>
          <Input
            id="form-login.email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="form-login.password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="form-login.password"
            name="password"
            type="password"
            required
          />
        </div>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button type="submit" className="w-full">
          Login
        </Button>
        {state.message && (
          <p className="rounded-sm bg-red-100 p-2 text-sm text-red-500">
            {state.message}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        {error && (
          <p className="rounded-sm bg-red-100 p-2 text-sm text-red-500">
            Account not found, use a different google account or sign up.
          </p>
        )}
        <Button
          onClick={(e) => {
            e.preventDefault();
            window.location.href = callbackUrl
              ? `/sign-in/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : '/sign-in/google';
          }}
          variant="outline"
          className="w-full"
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
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          href={
            callbackUrl ? `/sign-up?callbackUrl=${callbackUrl}` : '/sign-up'
          }
          className="underline underline-offset-4"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}
