'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { logoFont } from '@/lib/fonts';
import { Info, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import BetaContainer from './container';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { currentReleaseNotes } from './beta/_components/data';

export default function BetaHeader() {
  const groupLink =
    'https://chat.whatsapp.com/FlJmzv8JwfT2KhK1mVJQOd?mode=hqrc';

  const handleButtonClick = () => {
    window.open(groupLink, '_blank');
  };

  return (
    <header>
      <BetaContainer className="flex items-center justify-between py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="hidden sm:flex">
              <InfoIcon className="size-3" />
              v0.0.1
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="mb-4 flex flex-col gap-6 md:flex-row">
              <div className="flex h-12 w-12 min-w-12 items-center justify-center rounded-full bg-yellow-100">
                <Info className="text-primaryColor h-6 w-6" />
              </div>
              <div className="space-y-4">
                <DialogTitle className="text-lg font-bold">
                  Current Release Notes
                </DialogTitle>
                <p className="text-zinc-700">
                  Last Updated.{' '}
                  <span className="font-semibold">20/12/2025.</span>
                </p>
                <div className="space-y-2 text-sm">
                  {currentReleaseNotes.map((change, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-zinc-500" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  window.open('https://wa.me/+263717238876', '_blank');
                }}
              >
                Ask about Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div>
          <Link href="/beta" className="flex flex-col items-center">
            <span className={`${logoFont.className} block text-4xl`}>
              <span className="text-black">IB</span>
              <span className="text-primaryColor">ZIM</span>
            </span>
            <span className="hidden text-xs font-light tracking-[4px] text-zinc-700 sm:block">
              BETA PROGRAM
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleButtonClick}
            className="cursor-pointer hover:bg-zinc-700"
          >
            <Icons.whatsappSquareIcon className="size-5 text-[#25d366]" />
            Join Group
          </Button>
        </div>
      </BetaContainer>
    </header>
  );
}
