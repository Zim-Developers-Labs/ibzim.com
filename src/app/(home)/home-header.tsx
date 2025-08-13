import Container from '@/components/container';
import { Notifications } from '@/components/header/notifications';
import { SignToggler } from '@/components/header/sign-toggler';
import UserToggler from '@/components/header/user-toggler';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Grip } from 'lucide-react';
import Link from 'next/link';

type HeaderProps = {
  user?: any;
};

export default function HomeHeader({ user }: HeaderProps) {
  return (
    <header
      role="navigation"
      className="sticky top-0 z-50 w-full border-b border-zinc-700 bg-zinc-900 text-white"
    >
      <Container className="relative py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-2 lg:hidden">
            <Link href="#ib-tools">
              <Button
                variant="outline"
                className="relative cursor-pointer border-zinc-600 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              >
                <Grip className="h-5 w-5" />
                <span className="sr-only">View Tools</span>
              </Button>
            </Link>
            <Link href="/">
              <span className="sr-only" aria-hidden="true">
                IBZim logo
              </span>
              <Icons.logo className="h-7 w-fit md:hidden" />
            </Link>
          </div>
          <div className="hidden flex-1 lg:block">
            <Link href="#ib-tools">
              <Button
                variant="outline"
                className="relative flex cursor-pointer items-center gap-2 border-zinc-600 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              >
                <Grip className="h-5 w-5" />
                <span className="">Menu</span>
              </Button>
            </Link>
          </div>
          <Link
            href="/"
            className="absolute left-1/2 -m-1.5 -translate-x-1/2 transform p-1.5"
          >
            <span className="sr-only">IBZim Logo</span>
            <Icons.logo className="hidden h-8 w-fit md:block" />
          </Link>
          <div className="flex flex-none items-center gap-2 md:gap-4">
            <Notifications />
            {!user && <SignToggler />}
            {user && <UserToggler user={user} />}
          </div>
        </div>
      </Container>
    </header>
  );
}
