'use client';

import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';
import Link from 'next/link';

type Props = {
  bgColor?: string;
  textColor?: string;
  linkText?: string;
};

export function SignToggler({ bgColor, linkText, textColor }: Props) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Only access window after component has mounted (client-side)
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <Popover>
      <PopoverTrigger
        className={`group block h-fit cursor-pointer rounded-md px-4 py-2 text-sm ${
          bgColor
            ? `text-[${textColor}] bg-[${bgColor}] hover:bg-[${bgColor}]/85`
            : 'bg-teal-400 text-zinc-900 hover:bg-teal-500'
        }`}
        asChild
      >
        <span>
          <span className="hidden md:inline">
            {linkText ? linkText : 'Login / Register'}
          </span>
          <span className="inline md:hidden">
            {linkText ? linkText : 'Login'}
          </span>
        </span>
      </PopoverTrigger>
      <PopoverContent className="z-50 mx-2 mt-2 w-full rounded-md border border-zinc-200 bg-white p-4 shadow-lg sm:w-80">
        <div className="mb-4 flex items-center gap-2 border-b border-b-zinc-200 pb-4">
          <Icons.ibLogoSM className="h-6 w-6" />
          <span className="text-xs">Sign in to IBZim with your IB Account</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/sign-in?callbackUrl=${currentUrl}`}
            className="flex w-full items-center justify-center rounded-md bg-teal-400 px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-teal-500"
          >
            Login
          </Link>
          <Link
            href={`/sign-up?callbackUrl=${currentUrl}`}
            className="flex w-full items-center justify-center rounded-md bg-zinc-200 px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-300"
          >
            Register
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
