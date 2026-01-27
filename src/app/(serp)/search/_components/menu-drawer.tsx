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
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight, Grip } from 'lucide-react';
import { menuItems } from '@/app/(home)/component';

export function SERPMenuDrawer() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative cursor-pointer">
            <Grip className="h-5 w-5" />
            <span className="">Menu</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] bg-zinc-50 pl-0 sm:max-w-[756px] dark:bg-zinc-800">
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
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative cursor-pointer">
          <Grip className="h-5 w-5" />
          <span className="sr-only">View Tools</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-zinc-50 data-[vaul-drawer-direction=bottom]:max-h-[85vh] data-[vaul-drawer-direction=bottom]:rounded-t-4xl data-[vaul-drawer-direction=top]:max-h-[85vh] dark:bg-zinc-800">
        <DrawerHeader className="text-left">
          <DrawerTitle>IBZim Suite</DrawerTitle>
          {/* <DrawerDescription>
            Tools to help you find the information you need and express
            yourself.
          </DrawerDescription> */}
        </DrawerHeader>
        {/*  Added scroll instruction for mobile users */}
        <div className="mb-4 px-4 pb-2">
          <p className="flex items-center justify-center gap-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
            <span>Scroll right for more tools</span>
            <ChevronRight className="h-3 w-3" />
          </p>
        </div>
        <div className="relative">
          <div className="overflow-x-auto overflow-y-clip">
            <MobileMenuItems className="px-4" />
            <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-zinc-50 to-transparent dark:from-zinc-800" />
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
          <Card className="group h-full cursor-pointer border bg-white py-2 shadow-none hover:bg-zinc-50/50 dark:bg-zinc-900">
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
          <Card className="group h-full cursor-pointer border bg-white py-2 shadow-none hover:bg-zinc-50/50 dark:bg-zinc-900">
            <CardContent className="p-4 text-center">
              <h3 className="mb-1 text-sm leading-tight font-semibold sm:mb-2 sm:text-base">
                School Picker
              </h3>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">
                Sort & Filter through schools
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/tools/school-picker/best-primary-schools-in-zimbabwe"
                  className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300 dark:bg-teal-700 hover:dark:bg-teal-600"
                >
                  Primary
                  <ChevronRight className="ml-1 inline-block h-4 w-4" />
                </Link>
                <Link
                  href="/tools/school-picker/best-o-level-schools-in-zimbabwe"
                  className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300 dark:bg-teal-700 hover:dark:bg-teal-600"
                >
                  O&nbsp;Level
                  <ChevronRight className="ml-1 inline-block h-4 w-4" />
                </Link>
                <Link
                  href="/tools/school-picker/best-a-level-schools-in-zimbabwe"
                  className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300 dark:bg-teal-700 hover:dark:bg-teal-600"
                >
                  A&nbsp;Level
                  <ChevronRight className="ml-1 inline-block h-4 w-4" />
                </Link>

                <Link
                  href="/tools/school-picker/best-tertiary-institutions-in-zimbabwe"
                  className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300 dark:bg-teal-700 hover:dark:bg-teal-600"
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
            <li key={index}>
              <Link href={feature.href}>
                <Card className="group h-full cursor-pointer border py-2 shadow-none transition-all duration-300 hover:scale-105">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`mx-auto mt-2 mb-2 flex h-fit w-full items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-3`}
                    >
                      <Icon
                        className="h-10 w-10 sm:h-12 sm:w-12 dark:text-zinc-400"
                        strokeWidth={1}
                      />
                    </div>
                    <h3 className="mb-1 text-sm leading-tight font-semibold sm:mb-2 sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">
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
  );
}
