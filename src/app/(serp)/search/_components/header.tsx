import HomeUserToggler from '@/app/(home)/user-toggler';
import { SignToggler } from '@/components/header/sign-toggler';
import { Icons } from '@/components/icons';
import { User } from '@/lib/server/constants';
import SERPSearchToggler from './search-toggler';
import { SERPMenuDrawer } from './menu-drawer';
import Link from 'next/link';

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
          <Link href="/" className="flex items-center">
            <Icons.logo className="block h-6 w-fit cursor-pointer text-zinc-900 dark:text-white" />
          </Link>
          {/* desktop search toggler */}
          <div className="hidden w-full max-w-xl sm:block">
            <SERPSearchToggler q={q} />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-2">
          <SERPMenuDrawer />
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
