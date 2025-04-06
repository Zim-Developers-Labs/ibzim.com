'use client';

import { useState, useEffect } from 'react';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Popover } from '../ui/popover';
import { Icons } from '../icons';
import Link from 'next/link';

type Props = {
  bgColor?: string;
  textColor?: string;
  linkText?: string;
};

export function SignToggler({ bgColor, linkText, textColor }: Props) {
  const ibDomain =
    process.env.NODE_ENV === 'production'
      ? 'https://www.ibglobal.org'
      : 'http://localhost:3000';
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Only access window after component has mounted (client-side)
    setCurrentUrl(window.location.href);
  }, []);

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      window.open(`${ibDomain}/iblog-login?callbackUrl=${currentUrl}`);
    }
  };

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
        <span className="inline">
          {linkText ? linkText : 'Login / Register'}
        </span>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-80 rounded-md border border-zinc-200 bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center gap-2 border-b border-b-zinc-200 pb-4">
          <Icons.ibLogoSM className="h-6 w-6" />
          <span className="text-xs">Sign in to ibzim with your IB Account</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleLogin}
            className="w-full rounded-md bg-teal-400 px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-teal-500"
          >
            Login
          </button>
          <Link
            href={`${ibDomain}/sign-up?callbackUrl=${currentUrl}`}
            className="flex w-full items-center rounded-md bg-zinc-200 px-4 py-2 text-sm text-zinc-900 transition-colors hover:bg-zinc-300"
          >
            Register
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
