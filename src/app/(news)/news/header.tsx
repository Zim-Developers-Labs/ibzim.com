'use client';

import Container from '@/components/container';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { logoFont } from '@/lib/fonts';
import Link from 'next/link';

export default function CalculatorHeader() {
  const groupLink = 'https://wa.me/+263717238876';

  const handleButtonClick = () => {
    window.open(groupLink, '_blank');
  };

  return (
    <header className="relative overflow-hidden">
      <Container className="relative flex items-center justify-between py-4">
        <div>
          <Link href="/">
            <span className={`${logoFont.className} block text-4xl`}>
              <span className="text-zinc-900">IB</span>
              <span className="text-primaryColor">ZIM</span>
            </span>
          </Link>
        </div>
        <div>
          <Button
            onClick={handleButtonClick}
            className="cursor-pointer hover:bg-zinc-700"
          >
            <Icons.whatsappSquareIcon className="size-5 text-[#25d366]" />
            <span className="hidden sm:inline">Contact</span> Support
          </Button>
        </div>
      </Container>
      <div className="screen-line-after h-4 border-y border-zinc-200 before:absolute before:-z-1 before:h-4 before:w-screen before:bg-[repeating-linear-gradient(315deg,var(--color-zinc-300)_0,var(--color-zinc-300)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px]" />
    </header>
  );
}
