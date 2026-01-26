'use client';

import { ChevronRight, ChevronDownCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import SearchToggler from './search-toggler';
import { useUser } from '@/hooks/user-context';

export const menuItems = [
  {
    title: 'Choice Awards',
    description: 'Vote for your seasonal favorites',
    icon: Icons.ibzimAwardsIcon2,
    href: '/zimbabwe-peoples-choice-awards',
  },
  {
    title: 'News',
    description: 'Latest National and International News',
    icon: Icons.NewsIcon,
    href: '/news',
  },
  {
    title: 'Blog',
    description: 'Read latest articles and insights',
    icon: Icons.BookOpen,
    href: '/articles',
  },
  {
    title: 'Calculators',
    description: '4 Custom useful calculators',
    icon: Icons.toolsIcon,
    href: '/calculators',
  },
  {
    title: 'IBZIM Docs',
    description: 'Platform documentation and usage guides',
    icon: Icons.docsIcon,
    href: 'https://help.ibzim.com/docs/introduction',
  },
  {
    title: 'Biography Profiles',
    description: 'Explore notable personalities',
    icon: Icons.profilesIcon,
    href: '/profiles',
  },
  {
    title: 'Government',
    description: 'Zimbabwean Government Chart',
    icon: Icons.zimFlagRound,
    href: '#',
  },
];

export default function HomeComponent() {
  const { user } = useUser();
  return (
    <div className="relative w-full bg-zinc-100">
      {/* Search Section with Gradient Background */}
      <div className="from-primaryColor/25 via-secondaryColor/5 flex h-screen w-full flex-col justify-center bg-gradient-to-b to-transparent">
        <div className="mx-auto w-full max-w-4xl px-4">
          {/* Welcome Text */}
          <div className="mb-6 text-center sm:mb-8">
            <span className="mb-6 block text-3xl font-bold text-zinc-900 sm:mb-4 lg:text-4xl">
              Hi, {user ? user.fullName.split(' ')[0] : 'there'} 👋
            </span>
            <p className="text-base text-zinc-600">
              <span className="font-semibold text-zinc-900">IB</span>
              <span className="text-primaryColor font-semibold">ZIM</span>, a
              search engine for Zimbabwe
            </p>
          </div>

          {/* Search Box */}
          <div className="relative mb-8 flex w-full justify-center">
            <SearchToggler />
          </div>

          {/* OR Divider */}
          <div className="mb-6 flex items-center justify-center sm:mb-8">
            <div className="h-px max-w-32 flex-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
            <span className="px-4 text-sm font-medium text-zinc-500">OR</span>
            <div className="h-px max-w-32 flex-1 bg-gradient-to-l from-transparent via-zinc-300 to-transparent"></div>
          </div>

          {/* Choose a tool text */}
          <div className="text-center">
            <p className="text-base text-zinc-600">Scroll down</p>
            <ChevronDownCircle className="mx-auto mt-2 h-4 w-4 animate-bounce text-zinc-700" />
          </div>
        </div>
      </div>

      {/* Content Grid - White Background */}
      <div className="mx-auto max-w-6xl px-4 pb-12" id="ib-tools">
        {/* Content Cards */}
        <ul className="grid grid-cols-2 gap-3 rounded-lg bg-white p-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
          {/* <li>Weather Card</li> */}
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
          {menuItems.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li key={index} className="relative">
                <Link href={feature.href}>
                  <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                      >
                        <Icon
                          className="h-10 w-10 sm:h-12 sm:w-12"
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
        </ul>
      </div>
    </div>
  );
}
