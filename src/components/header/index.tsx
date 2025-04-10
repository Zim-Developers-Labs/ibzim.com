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
import ReactCountryFlag from 'react-country-flag';
import SearchToggler from './search-toggler';
import { SignToggler } from './sign-toggler';
import SideBar from './side-bar';
import Link from 'next/link';
import Container from '../container';
import UserToggler from './user-toggler';

type NavType = {
  name: string;
  href?: string;
  links?: {
    name: string;
    href: string;
    rel?: string;
    countryCode?: string;
  }[];
};

export const iblogs = [
  {
    name: 'Africa',
    href: 'https://www.iblogafrica.com',
  },
  {
    name: 'Ghana',
    href: 'https://www.ibgan.com',
    countryCode: 'gh',
  },
  {
    name: 'Kenya',
    href: 'https://www.ibken.com',
    countryCode: 'ke',
  },
  {
    name: 'Nigeria',
    href: 'https://www.iblogng.com',
    countryCode: 'ng',
  },
  {
    name: 'South Africa',
    href: 'https://www.iblogsa.com',
    countryCode: 'za',
  },
  {
    name: 'United Kingdom',
    href: 'https://www.ibloguk.com',
    countryCode: 'gb',
  },
  {
    name: 'Zimbabwe',
    href: 'https://www.ibzim.com',
    countryCode: 'zw',
  },
];

export const tools = [
  {
    name: 'Ecocash Calculator',
    href: '#',
  },
  {
    name: 'School Picker',
    href: '#',
  },
];

export const company = [
  {
    name: 'Jobs',
    href: '#',
  },
  {
    name: 'Press',
    href: 'https://www.ibglobal.org/press',
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
              <Icons.logoSm
                className="h-10 w-fit md:hidden"
                primaryColor="#000"
                secondaryColor="#EAB308"
              />
            </Link>
          </div>
          <div className="hidden flex-1 lg:flex lg:gap-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>iBlogs</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col md:w-[200px] lg:w-[200px]">
                      {iblogs.map((nav) => (
                        <li key={nav.name}>
                          <NavigationMenuLink
                            href={nav.href}
                            className="group flex w-full flex-row items-center justify-between rounded-lg p-3 hover:bg-gray-50"
                          >
                            <span className="flex items-center">
                              <ChevronRightIcon className="group-hover:text-primaryColor mr-1 size-3" />
                              <span className="text-sm text-gray-900">
                                {nav.name}
                              </span>
                            </span>
                            {nav.countryCode && (
                              <ReactCountryFlag
                                className="inline-flex h-5 w-fit"
                                countryCode={nav.countryCode}
                                svg
                              />
                            )}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/premium"
                    className="rounded-md bg-gradient-to-tr from-yellow-500 via-yellow-600 to-yellow-500 px-2 text-white hover:text-white"
                  >
                    Premium
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
                    className="group flex w-full flex-row items-center rounded-lg p-3 hover:bg-gray-50"
                  >
                    News
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col md:w-[200px] lg:w-[200px]">
                      {company.map((nav) => (
                        <li key={nav.name}>
                          <NavigationMenuLink
                            href={nav.href}
                            className="group flex w-full flex-row items-center rounded-lg p-3 hover:bg-gray-50"
                            asChild
                          >
                            <span className="flex items-center">
                              <ChevronRightIcon className="group-hover:text-primaryColor mr-1 size-3" />
                              <span className="text-sm text-gray-900">
                                {nav.name}
                              </span>
                            </span>
                          </NavigationMenuLink>
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
            <Icons.logoSm
              className="hidden h-10 w-fit md:block"
              primaryColor="#000"
              secondaryColor="#EAB308"
            />
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
