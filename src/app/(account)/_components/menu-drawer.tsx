'use client';

import * as React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Link from 'next/link';
import { ChevronRight, Info } from 'lucide-react';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { menuItems } from './menu-items';
import Image from 'next/image';
import posterImage from '@/app/(home)/news-poster.png';
import { PaperAirplaneIcon } from '@heroicons/react/16/solid';

export function MenuDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-[90vh] bg-zinc-50 pl-0 sm:max-w-[756px]">
          <DialogHeader className="pl-6">
            <DialogTitle>IBZim Suite</DialogTitle>
            {/* <DialogDescription>
              Tools to help you find the information you need and express
              yourself.
            </DialogDescription> */}
          </DialogHeader>
          <div className="overflow-y-auto">
            <DesktopMenuItems />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-zinc-50 data-[vaul-drawer-direction=bottom]:max-h-[90vh] data-[vaul-drawer-direction=bottom]:rounded-t-4xl data-[vaul-drawer-direction=top]:max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>IBZim Suite</DrawerTitle>
          {/* <DrawerDescription>
            Tools to help you find the information you need and express
            yourself.
          </DrawerDescription> */}
        </DrawerHeader>
        {/*  Added scroll instruction for mobile users */}
        <div className="mb-4 px-4 pb-2">
          <p className="flex items-center justify-center gap-1 text-center text-xs text-zinc-500">
            <span>Scroll right for more tools</span>
            <ChevronRight className="h-3 w-3" />
          </p>
        </div>
        <div className="relative">
          <div className="overflow-x-auto overflow-y-clip">
            <MobileMenuItems className="px-4" />
            <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-zinc-50 to-transparent" />
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MobileMenuItems({ className }: React.ComponentProps<'form'>) {
  return (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>
      <ul
        id="ib-tools"
        className="grid w-[1100px] grid-cols-[repeat(5,_minmax(200px,_1fr))] grid-rows-2 gap-3 pr-20 pb-10"
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
            href="/news"
            className="relative mx-auto block h-full w-auto overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Image
              className="w-full"
              src={posterImage}
              alt="IBZIM NEWS BANNER"
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
              priority
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset sm:rounded-xl lg:rounded-2xl" />
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
          <Link href="#">
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
                  Zimbabwean Government Chart
                </p>
              </CardContent>
            </Card>
          </Link>
        </li>
        {menuItems.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <li key={index} className="relative">
              <Link href={feature.href}>
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-zinc-50/50">
                  <CardContent className="p-4 text-center">
                    {feature.isFeatured ? (
                      <div
                        className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                      >
                        <Icon
                          className="h-10 w-10 sm:h-12 sm:w-12"
                          strokeWidth={1}
                        />
                      </div>
                    ) : (
                      <div
                        className={`from-primaryColor/20 to-primaryColor/5 mx-auto mb-3 flex h-fit w-full items-center justify-center rounded-md bg-gradient-to-br p-4 transition-transform duration-300 group-hover:scale-110 sm:mb-4`}
                      >
                        <Icon
                          className="h-6 w-6 text-zinc-700 sm:h-8 sm:w-8"
                          strokeWidth={1}
                        />
                      </div>
                    )}
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
        <li>
          <Link
            href="https://wa.me/+263717238876"
            target="_blank"
            rel="nofollow"
          >
            <Card className="group h-full cursor-pointer border border-zinc-200 bg-[#103928] py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-[#165239]">
              <CardContent className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                <div
                  className={`mx-auto mb-3 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                >
                  <Icons.whatsapp
                    className="h-10 w-10 text-white sm:h-12 sm:w-12"
                    strokeWidth={1}
                  />
                </div>
                <Button className="rounded-full bg-[#43cd66] text-[#103928] hover:bg-[#38b159]">
                  Support
                  <PaperAirplaneIcon className="inline-block h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </li>
      </ul>
    </div>
  );
}

function DesktopMenuItems({ className }: React.ComponentProps<'form'>) {
  return (
    <div className={`px-6 pt-6 ${className}`}>
      <ul
        id="ib-tools"
        className="grid -translate-y-40 grid-cols-2 gap-3 pt-40 sm:grid-cols-3 sm:gap-4 lg:gap-6"
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
            href="/news"
            className="relative mx-auto block h-full w-auto overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Image
              className="w-full"
              src={posterImage}
              alt="IBZIM NEWS BANNER"
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
              priority
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset sm:rounded-xl lg:rounded-2xl" />
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
          <Link href="#">
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
                  Zimbabwean Government Chart
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
                <Card className="group h-full cursor-pointer border border-zinc-200 bg-white py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-yellow-100">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`from-primaryColor/10 via-secondaryColor/5 mx-auto mb-3 flex h-fit w-full items-center justify-center rounded-md bg-gradient-to-br to-transparent p-4 transition-transform duration-300 group-hover:scale-110 sm:mb-4`}
                    >
                      <Icon
                        className="h-6 w-6 text-zinc-700 sm:h-8 sm:w-8"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold text-zinc-900 sm:mb-2 sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="https://wa.me/+263717238876"
            target="_blank"
            rel="nofollow"
          >
            <Card className="group h-full min-h-[200px] cursor-pointer border border-zinc-200 bg-[#103928] py-2 shadow-none transition-all duration-300 hover:scale-105 hover:bg-[#165239]">
              <CardContent className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                <div
                  className={`mx-auto mb-3 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                >
                  <Icons.whatsapp
                    className="h-10 w-10 text-white sm:h-12 sm:w-12"
                    strokeWidth={1}
                  />
                </div>
                <Button className="rounded-full bg-[#43cd66] text-[#103928] hover:bg-[#38b159]">
                  Get Help
                  <PaperAirplaneIcon className="inline-block h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </li>
      </ul>
    </div>
  );
}
