import Container from '@/components/container';
import { Notifications } from '@/components/header/notifications';
import SearchToggler from '@/components/header/search-toggler';
import { SignToggler } from '@/components/header/sign-toggler';
import UserToggler from '@/components/header/user-toggler';
import { Icons } from '@/components/icons';
import { Grip, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { MenuDrawer } from './menu-drawer';

export const tools = [
  {
    name: 'Events Calendar',
    href: '/tools/events-calendar',
  },
  {
    name: 'Ecocash Calculator',
    href: '/tools/ecocash-calculator',
  },
  {
    name: 'Travel Planner',
    href: '/tools/travel-planner',
  },
  {
    name: 'School Picker',
    href: '/tools/school-picker/best-a-level-schools',
  },
  {
    name: 'Currency Converter',
    href: '/tools/currency-converter/usd-zig',
  },
  {
    name: 'ZESA Calculator',
    href: '/tools/zesa-electricity-calculator',
  },
];

type HeaderProps = {
  user?: any;
  articles?: any[];
  popularArticles?: any[];
};

export default function Header({
  articles,
  popularArticles,
  user,
}: HeaderProps) {
  return (
    <header
      role="navigation"
      className="sticky top-0 z-50 w-full border-b border-zinc-700 bg-zinc-900 text-white"
    >
      <Container className="relative py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-4 lg:hidden">
            <MenuDrawer>
              <Button
                variant="outline"
                className="relative cursor-pointer border-zinc-600 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              >
                <Grip className="h-5 w-5" />
                <span className="sr-only">View Tools</span>
              </Button>
            </MenuDrawer>
            <Link href="/">
              <span className="sr-only" aria-hidden="true">
                IBZim logo
              </span>
              <Icons.logo className="h-7 w-fit" />
            </Link>
          </div>
          <div className="hidden flex-1 items-center lg:flex lg:gap-x-6">
            <MenuDrawer>
              <Button
                variant="outline"
                className="relative cursor-pointer border-zinc-600 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
              >
                <Grip className="h-5 w-5" />
                <span className="">Menu</span>
              </Button>
            </MenuDrawer>
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
              >
                <Button
                  variant="outline"
                  className="relative w-full cursor-pointer border-zinc-600 bg-zinc-800 hover:bg-zinc-600"
                >
                  <Search className="size-5 text-zinc-300" />
                  <div className="pr-2 text-xs text-zinc-300">
                    Search/Request Articles
                  </div>
                </Button>
              </SearchToggler>
            </div>
          )}
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
