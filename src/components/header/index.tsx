import { ChevronRightIcon } from 'lucide-react';
import { Icons } from '../icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import SearchToggler from './search-toggler';
import { SignToggler } from './sign-toggler';
import SideBar from './side-bar';
import Link from 'next/link';
import Container from '../container';
import UserToggler from './user-toggler';

export const tools = [
  {
    name: 'Ecocash Calculator',
    href: '/tools/ecocash-calculator',
  },
  {
    name: 'School Picker',
    href: '/tools/school-picker',
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
      className="relative w-full border-b border-zinc-200 bg-white text-zinc-900"
    >
      <Container className="py-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-x-4 lg:hidden">
            <SideBar />
            <Link href="/">
              <span className="sr-only" aria-hidden="true">
                IBZim logo
              </span>
              <Icons.logo className="h-7 w-fit md:hidden" />
            </Link>
          </div>
          <div className="hidden flex-1 lg:flex lg:gap-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/calendar"
                    target="_blank"
                    className="group relative flex w-full flex-row items-center rounded-lg p-3 hover:bg-gray-50"
                  >
                    Calendar
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/awards/2025"
                    target="_blank"
                    className="rounded-md bg-gradient-to-tr from-yellow-500 via-yellow-600 to-yellow-500 px-2 text-white hover:text-white"
                  >
                    2025 Awards
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="https://news.ibzim.com"
                    target="_blank"
                    rel="nofollow"
                    className="group relative flex w-full flex-row items-center rounded-lg p-3 hover:bg-gray-50"
                  >
                    News
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/tools">
                    <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                  </Link>
                  <NavigationMenuContent>
                    <ul className="flex flex-col md:w-[200px] lg:w-[200px]">
                      {tools.map((nav) => (
                        <li key={nav.name}>
                          <Link
                            href={nav.href}
                            className="group flex w-full flex-row items-center rounded-lg p-3 hover:bg-gray-50"
                          >
                            <span className="flex items-center">
                              <ChevronRightIcon className="group-hover:text-primaryColor mr-1 size-3" />
                              <span className="text-sm text-gray-900">
                                {nav.name}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Link
            href="/"
            className="absolute left-1/2 -m-1.5 -translate-x-1/2 transform p-1.5"
          >
            <span className="sr-only">IBZim Logo</span>
            <Icons.logo className="hidden h-8 w-fit md:block" />
          </Link>
          <div className="flex flex-none items-center gap-2 md:gap-4">
            {articles && popularArticles && (
              <SearchToggler
                articles={articles}
                popularArticles={popularArticles}
              />
            )}
            {!user && <SignToggler />}
            {user && <UserToggler user={user} />}
          </div>
        </div>
      </Container>
    </header>
  );
}
