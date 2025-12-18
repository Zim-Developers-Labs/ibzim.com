'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { logoFont } from '@/lib/fonts';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import BetaContainer from './container';

export default function BetaHeader() {
  const groupLink =
    'https://chat.whatsapp.com/FlJmzv8JwfT2KhK1mVJQOd?mode=hqrc';

  const handleButtonClick = () => {
    window.open(groupLink, '_blank');
  };

  return (
    <header>
      <BetaContainer className="flex items-center justify-between py-4">
        <Button variant="outline" className="hidden sm:flex">
          <InfoIcon className="size-3" />
          v0.12.1
        </Button>
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
