import Container from '@/components/container';
import { SignToggler } from '@/components/header/sign-toggler';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/server/constants';
import { Grip } from 'lucide-react';
import Link from 'next/link';
import HomeUserToggler from './user-toggler';

type HeaderProps = {
  user: User | null;
};

export default function HomeHeader({ user }: HeaderProps) {
  return (
    <header
      role="navigation"
      className="fixed top-[10px] right-0 z-50 w-fit py-4"
    >
      <Container className="flex items-center gap-2">
        <Button variant="outline" className="dark:bg-zinc-700" asChild>
          <Link href="#ib-tools">
            <Grip className="h-5 w-5" />
            <span className="sr-only">View Tools</span>
          </Link>
        </Button>
        <aside className="flex flex-none items-center gap-2 md:gap-4">
          {!user && <SignToggler />}
          {user && <HomeUserToggler user={user} />}
        </aside>
      </Container>
    </header>
  );
}
