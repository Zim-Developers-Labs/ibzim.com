import Container from '@/components/container';
import SearchToggler from '@/components/header/search-toggler';
import { SignToggler } from '@/components/header/sign-toggler';
import UserToggler from '@/components/header/user-toggler';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { MenuDrawer } from './menu-drawer';
import { NotificationType } from '@/types';
import { Button } from '../ui/button';

export const tools = [
  {
    name: 'School Picker',
    href: '/tools/school-picker/best-a-level-schools-in-zimbabwe',
  },
  {
    name: 'Calculators',
    href: '/calculators',
  },
];

type HeaderProps = {
  user?: any;
  articles?: any[];
  popularArticles?: any[];
  starsCount: number;
};

export default function Header({
  articles,
  popularArticles,
  user,
  starsCount,
}: HeaderProps) {
  return (
    <header
      role="navigation"
      className="sticky top-0 z-50 w-full border-b border-zinc-700 bg-zinc-900 text-white"
    >
      <Container className="relative py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-4 lg:hidden">
            <MenuDrawer />
            <Link href="/">
              <span className="sr-only" aria-hidden="true">
                IBZim logo
              </span>
              <Icons.logo className="h-7 w-fit" />
            </Link>
          </div>
          <div className="hidden flex-1 items-center lg:flex lg:gap-x-6">
            <MenuDrawer />
            <Link href="/" className="">
              <span className="sr-only">IBZim Logo</span>
              <Icons.logo className="hidden h-8 w-fit md:block" />
            </Link>
          </div>
          {articles && popularArticles && (
            <div className="absolute left-1/2 z-0 -m-1.5 hidden w-fit -translate-x-1/2 transform p-1.5 md:block lg:w-full lg:max-w-sm xl:max-w-lg">
              <SearchToggler
                articles={articles}
                popularArticles={popularArticles}
              />
            </div>
          )}
          <div className="flex flex-none items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              className="relative cursor-pointer border-zinc-600 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              asChild
            >
              <Link
                href="https://github.com/Zim-Developers-Labs/ibzim.com"
                target="_blank"
              >
                <Icons.gitHub className="h-5 w-5" />
                {starsCount > 1000
                  ? `${(starsCount / 1000).toFixed(1)}k`
                  : starsCount.toLocaleString()}{' '}
                <span className="hidden md:inline">stars</span>
              </Link>
            </Button>
            {!user && <SignToggler />}
            {user && <UserToggler user={user} />}
          </div>
        </div>
      </Container>
    </header>
  );
}
