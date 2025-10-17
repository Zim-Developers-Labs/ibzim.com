'use client';

import {
  Calendar,
  Calculator,
  MapPin,
  DollarSign,
  Zap,
  UserIcon,
  ChevronRight,
  Search,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import SearchToggler from './search-toggler';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GithubIcon } from '@sanity/icons';
import { useUser } from '@/hooks/user-context';
import { DOMAIN_URLS } from '@/lib/constants';
import Image from 'next/image';
import posterImage from './billboard-poster.png';
import CompareFeature from './compare';

export const menuItems = [
  {
    title: 'Biography Profiles',
    description: 'Explore notable personalities',
    icon: UserIcon,
    href: '/profiles',
    isOpenSource: false,
  },
  {
    title: 'Events Calendar',
    description: 'Discover upcoming events',
    icon: Calendar,
    href: '/tools/events-calendar',
    isOpenSource: false,
  },
  {
    title: 'Ecocash Calculator',
    description: 'Transaction fees',
    icon: Calculator,
    href: 'https://tools.zimdevelopers.com/ecocash-calculator',
    isOpenSource: true,
  },

  {
    title: 'Travel Planner',
    description: 'Plan your next trip',
    icon: MapPin,
    href: 'https://tools.zimdevelopers.com/travel-planner',
    isOpenSource: true,
  },
  {
    title: 'Currency Converter',
    description: 'Convert local currencies',
    icon: DollarSign,
    href: 'https://tools.zimdevelopers.com/currency-converter/usd-zig',
    isOpenSource: true,
  },
  {
    title: 'ZESA Calculator',
    description: 'Electricity costs',
    icon: Zap,
    href: 'https://tools.zimdevelopers.com/zesa-electricity-calculator',
    isOpenSource: true,
  },
  {
    title: 'Support',
    description: 'Get help and assistance',
    icon: HelpCircle,
    href: '/support',
    gradient: 'from-primaryColor/20 to-primaryColor/5',
  },
];

export default function HomeComponent({
  articles,
  popularArticles,
}: {
  articles?: any[];
  popularArticles?: any[];
}) {
  const { user } = useUser();
  return (
    <div className="relative min-h-screen bg-white">
      {/* Search Section with Gradient Background */}
      <div className="from-primaryColor/10 via-secondaryColor/5 bg-gradient-to-b to-transparent py-12">
        <div className="mx-auto max-w-4xl px-4 pt-6">
          {/* Welcome Text */}
          <div className="mb-6 text-center sm:mb-8">
            <span className="mb-6 block text-3xl font-bold text-zinc-900 sm:mb-4 lg:text-4xl">
              Hi, {user ? user.fullName.split(' ')[0] : 'there'} 👋
            </span>
            <p className="text-base text-zinc-600">
              Search anything about Zimbabwe to get started
            </p>
          </div>

          {/* Search Box */}
          <div className="relative mb-8 flex w-full justify-center">
            <SearchToggler
              articles={articles}
              popularArticles={popularArticles}
            />
          </div>

          {/* OR Divider */}
          <div className="mb-6 flex items-center justify-center sm:mb-8">
            <div className="h-px max-w-32 flex-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
            <span className="px-4 text-sm font-medium text-zinc-500">OR</span>
            <div className="h-px max-w-32 flex-1 bg-gradient-to-l from-transparent via-zinc-300 to-transparent"></div>
          </div>

          {/* Choose a tool text */}
          <div className="mb-4 text-center">
            <p className="text-base text-zinc-600">
              Choose a tool to get started
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid - White Background */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul
            id="ib-tools"
            className="grid -translate-y-40 grid-cols-2 gap-3 pt-40 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5"
          >
            <li className="col-span-2">
              <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none hover:bg-zinc-50/50">
                <CardContent className="p-4 text-center">
                  <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                    School Picker
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                    Sort & Filter through schools
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href="/tools/school-picker/best-primary-schools-in-zimbabwe"
                      className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                    >
                      Primary
                      <ChevronRight className="ml-1 inline-block h-4 w-4" />
                    </Link>
                    <Link
                      href="/tools/school-picker/best-o-level-schools-in-zimbabwe"
                      className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                    >
                      O&nbsp;Level
                      <ChevronRight className="ml-1 inline-block h-4 w-4" />
                    </Link>
                    <Link
                      href="/tools/school-picker/best-a-level-schools-in-zimbabwe"
                      className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                    >
                      A&nbsp;Level
                      <ChevronRight className="ml-1 inline-block h-4 w-4" />
                    </Link>

                    <Link
                      href="/tools/school-picker/best-tertiary-institutions-in-zimbabwe"
                      className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                    >
                      Tertiary
                      <ChevronRight className="ml-1 inline-block h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
            <li>
              <Link href="/zimbabwe-peoples-choice-awards">
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icons.ibzimAwardsIcon
                        className="text-primaryColor h-10 w-10 sm:h-12 sm:w-12"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      People&#39;s Choice Awards
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      Vote for your favourites
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
            <li>
              <Link
                href={DOMAIN_URLS.BILLBOARD()}
                className="relative mx-auto block h-full w-auto overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
                aria-label="Homepage"
              >
                <Image
                  className="w-full"
                  src={posterImage}
                  alt=""
                  sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
                  priority
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset sm:rounded-xl lg:rounded-2xl" />
              </Link>
            </li>
            {/* <li>
              <Link href="https://www.zimdevelopers.com">
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icons.zimdevelopersIcon
                        className="text-primaryColor h-10 w-10 sm:h-12 sm:w-12"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      Developers Labs
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      Hire a developer or get hired
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li> */}
            <li>
              <Link href={DOMAIN_URLS.EARN()}>
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icons.earnLogo
                        className="h-10 w-10 sm:h-12 sm:w-12"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      Earn
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      Convert your knowledge into income
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
            {/* <li>
              <Link href="https://www.peyapeya.com">
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icons.peyapeyaPLogo
                        className="h-10 w-10 sm:h-12 sm:w-12"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      Peya Peya
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      Best finance app in Zimbabwe
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li> */}
            <li>
              <Link href={DOMAIN_URLS.ADVERTISE()}>
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icons.advertisingALogo
                        className="h-10 w-10 sm:h-12 sm:w-12"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      Advertising
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      Reach thousands of Zimbabweans
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
            <li>
              <Link href="/articles">
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icons.ibLogoSM
                        className="h-10 w-10 sm:h-12 sm:w-12"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      Articles Blog
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      Read latest articles and insights
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
            <li>
              <Link href="/zimbabwean-government-structure">
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icons.zimFlagRound
                        className="h-10 w-10 sm:h-12 sm:w-12"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      Government
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      Zimbabwean Government Structure
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
            {menuItems.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <li key={index}>
                  <Link href={feature.href}>
                    <Card className="group relative h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                      <CardContent className="p-4 text-center">
                        {feature.isOpenSource && (
                          <Badge
                            variant="secondary"
                            className="absolute right-2 bottom-2 flex items-center gap-1 bg-green-100 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
                          >
                            <GithubIcon className="h-3 w-3" />
                            Open Source
                          </Badge>
                        )}
                        <div
                          className={`from-primaryColor/20 to-primaryColor/5 mx-auto mb-3 flex h-fit w-full items-center justify-center rounded-md bg-gradient-to-br p-4 transition-transform duration-300 group-hover:scale-110 sm:mb-4`}
                        >
                          <Icon
                            className="h-6 w-6 text-zinc-700 sm:h-8 sm:w-8"
                            strokeWidth={1}
                          />
                        </div>
                        <h3 className="mb-1 text-sm leading-tight font-semibold text-nowrap text-zinc-900 sm:mb-2 sm:text-base">
                          {feature.title}
                        </h3>
                        <p className="text-no-wrap mb-2 text-xs leading-relaxed text-zinc-600 sm:text-sm md:pb-0">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
            <CompareFeature />
          </ul>
        </div>
      </div>
    </div>
  );
}
