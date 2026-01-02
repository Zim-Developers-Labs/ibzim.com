'use client';
import { cn } from '@/lib/utils';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageCircle } from 'lucide-react';
import { Icons } from './icons';

export function TempErrForm({
  className,
  callbackUrl,
  ...props
}: React.ComponentProps<'div'> & { callbackUrl?: string; error?: string }) {
  const whatsappMessage = encodeURIComponent(
    "Hi, I'd like to be notified when authentication is back up and running.",
  );
  const whatsappLink = `https://wa.me/+263717238876?text=${whatsappMessage}`;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold">We're Sorry</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Our authentication system is temporarily unavailable. We sincerely
          apologize for any inconvenience this may cause. Our team is working
          hard to restore access as soon as possible.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          asChild
          className="w-full bg-[#25d366] text-black hover:bg-[#25d366]/80"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Icons.whatsappSquareIcon className="mr-2 h-4 w-4 text-black" />
            Notify Me When It's Ready
          </a>
        </Button>
        <Button
          onClick={() => {
            window.location.href = callbackUrl || '/';
          }}
          className="w-full"
        >
          {callbackUrl ? 'Back to Site' : 'Go to Home'}
        </Button>
      </div>
    </div>
  );
}
