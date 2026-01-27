'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';
import Link from 'next/link';
import { Button } from '../ui/button';

type Props = {
  bgColor?: string;
  textColor?: string;
  linkText?: string;
};

export function SignToggler({ bgColor, linkText, textColor }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onSignInClick = () => {
    window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(window.location.href)}`;
  };

  const onSignUpClick = () => {
    window.location.href = `/sign-up?callbackUrl=${encodeURIComponent(window.location.href)}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        className={`group cursor-pointer ${
          bgColor
            ? `text-[${textColor}] bg-[${bgColor}] hover:bg-[${bgColor}]/85`
            : 'bg-teal-400 text-zinc-900 hover:bg-teal-500'
        }`}
        asChild
      >
        <Button>
          <span className="hidden md:inline">
            {linkText ? linkText : 'Login / Register'}
          </span>
          <span className="inline md:hidden">
            {linkText ? linkText : 'Login'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 mt-2 w-full rounded-md border p-4 shadow-lg sm:w-80"
        align="end"
      >
        <div className="mb-4 flex items-center gap-2 border-b border-b-zinc-200 pb-4 dark:border-b-zinc-700">
          <Icons.ibLogoSM className="h-6 w-6" />
          <span className="text-xs">Sign in to IBZim with your IB Account</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/sign-in`}
            onClick={(e) => {
              e.preventDefault();
              onSignInClick();
            }}
            className="flex w-full items-center justify-center rounded-md bg-teal-400 px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-teal-500"
          >
            Login
          </Link>
          <Link
            href={`/sign-up`}
            onClick={(e) => {
              e.preventDefault();
              onSignUpClick();
            }}
            className="flex w-full items-center justify-center rounded-md bg-zinc-200 px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-300"
          >
            Register
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
