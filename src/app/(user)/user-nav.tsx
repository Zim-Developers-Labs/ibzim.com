'use client';

import { ChevronRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/16/solid';

type NavLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

function NavLink({ className, href, children }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        className,
        pathname?.includes(href) ? 'text-primaryColor' : '',
      )}
    >
      {children}
    </Link>
  );
}

export default function UserNav() {
  return (
    <section className="relative mx-auto my-8 hidden w-full max-w-7xl px-4 sm:px-8 lg:block lg:px-12">
      <nav className="flex items-center justify-between rounded-sm border border-zinc-100 bg-zinc-50 p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <UserIcon className="text-primaryColor h-8 w-full" />
              <div>User</div>
            </div>
            <ChevronRightIcon className="h-4 w-fit" />
          </div>
          <NavLink href="/user/library/saved-articles">
            <span>Library</span>
          </NavLink>
          {/* <NavLink href="/user/achievements">
            <span>Achievements</span>
          </NavLink> */}
        </div>
        <NavLink
          href="/user/settings/profile-customization"
          className="flex items-center gap-2"
        >
          <Cog6ToothIcon className="text-primaryColor h-fit w-8" />
          <div>Settings</div>
        </NavLink>
      </nav>
    </section>
  );
}
