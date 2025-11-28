import Container from '@/components/container';
import { Notifications } from '@/components/header/notifications';
import SearchToggler from '@/components/header/search-toggler';
import { SignToggler } from '@/components/header/sign-toggler';
import UserToggler from '@/components/header/user-toggler';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { MenuDrawer } from './menu-drawer';
import { NotificationType } from '@/types';

export const tools = [
  {
    name: 'Events Calendar',
    href: '/tools/events-calendar',
  },
  {
    name: 'School Picker',
    href: '/tools/school-picker/best-a-level-schools-in-zimbabwe',
  },
  {
    name: 'Ecocash Calculator',
    href: 'https://tools.zimdevelopers.com/tools/ecocash-calculator',
  },
  {
    name: 'Travel Planner',
    href: 'https://tools.zimdevelopers.com/tools/travel-planner',
  },
  {
    name: 'Currency Converter',
    href: 'https://tools.zimdevelopers.com/tools/currency-converter/usd-zig',
  },
  {
    name: 'ZESA Calculator',
    href: 'https://tools.zimdevelopers.com/tools/zesa-electricity-calculator',
  },
];

type HeaderProps = {
  user?: any;
  articles?: any[];
  popularArticles?: any[];
  sanityGlobalNotifications?: NotificationType[];
  neonUserNotifications?: NotificationType[];
};

export default function Header({
  articles,
  popularArticles,
  user,
  neonUserNotifications,
  sanityGlobalNotifications,
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
            <Notifications
              user={user}
              neonUserNotifications={neonUserNotifications}
              sanityGlobalNotifications={sanityGlobalNotifications}
            />
            {!user && <SignToggler />}
            {user && <UserToggler user={user} />}
          </div>
        </div>
      </Container>
    </header>
  );
}
