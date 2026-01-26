import HomeUserToggler from '@/app/(home)/user-toggler';
import Container from '@/components/container';
import { SignToggler } from '@/components/header/sign-toggler';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/server/constants';
import { Grip } from 'lucide-react';
import Link from 'next/link';
import SERPSearchToggler from './search-toggler';

type HeaderProps = {
  user: User | null;
  q: string;
};

export default function SERPHeader({ user, q }: HeaderProps) {
  return (
    <header
      role="navigation"
      className="absolute top-[10px] z-50 w-full px-4 py-4 md:px-8"
    >
      <div className="mb-4 flex w-full items-center justify-between sm:mb-0">
        <div className="flex w-full items-center gap-4">
          <div>
            <Icons.logo className="block h-6 w-fit cursor-pointer text-zinc-900" />
          </div>
          {/* desktop search toggler */}
          <div className="hidden w-full max-w-2xl sm:block">
            <SERPSearchToggler q={q} />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="#ib-tools">
              <Grip className="h-5 w-5" />
              <span className="sr-only">View Tools</span>
            </Link>
          </Button>
          <aside className="flex flex-none items-center gap-2 md:gap-4">
            {!user && <SignToggler />}
            {user && <HomeUserToggler user={user} />}
          </aside>
        </div>
      </div>
      {/* mobile search toggler */}
      <div className="block sm:hidden">
        <SERPSearchToggler q={q} />
      </div>
    </header>
  );
}
