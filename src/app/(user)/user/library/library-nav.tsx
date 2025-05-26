'use client';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactElement, useState } from 'react';

export type SettingsNavItem = {
  title: string;
  description: string;
  href: string;
  icon: (props: any) => ReactElement;
  current: boolean;
};

const navitems = [
  {
    title: 'Saved Articles',
    description: 'View and manage all your saved articles',
    current: false,
    href: '/user/library/saved-articles',
    icon: (props: any) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    ),
  },
  {
    title: 'My Comments',
    description: 'View and manage all your comments',
    current: false,
    href: '/user/library/comments',
    icon: (props: any) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    ),
  },
] satisfies SettingsNavItem[];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function LibraryNav() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = navitems.find((item) => pathname?.includes(item.href))?.title;

  return (
    <div>
      <nav className="hidden w-full max-w-[350px] flex-col gap-6 pr-4 md:flex">
        {navitems.map((item, i) => (
          <Link
            href={item.href}
            key={i}
            className={cn(
              'flex h-fit items-center justify-between gap-6 rounded-md p-2',
              pathname?.includes(item.href)
                ? 'bg-primaryColor'
                : 'hover:bg-primaryColor/20',
            )}
          >
            <span className="flex items-center gap-2">
              <span className="block min-w-8">
                <item.icon
                  className={cn(
                    'h-fit w-6',
                    pathname?.includes(item.href)
                      ? 'text-black'
                      : 'text-primaryColor',
                  )}
                />
              </span>
              <span>
                <span className="block font-bold">{item.title}</span>
                <span className="block text-sm">{item.description}</span>
              </span>
            </span>
            <div className="block min-w-6">
              <ChevronRightIcon className="h-4 w-fit" />
            </div>
          </Link>
        ))}
      </nav>
      <nav className="mb-6 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <div className="text-sm text-gray-600">Library</div>
            <div className="text-gray-600">/</div>
            <div className="text-lg font-semibold">{active}</div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid h-[40px] w-[40px] place-content-center rounded-md border border-gray-200"
          >
            <Bars3Icon className="size-5" />
          </button>
          <Dialog
            open={sidebarOpen}
            onClose={setSidebarOpen}
            className="relative z-50 md:hidden"
          >
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-900/60 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 flex">
              <DialogPanel
                transition
                className="relative mt-72 flex w-full flex-1 transform transition duration-300 ease-in-out data-[closed]:translate-y-full"
              >
                <TransitionChild>
                  <div className="absolute top-0 right-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="-m-2.5 p-2.5"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        aria-hidden="true"
                        className="size-6 text-black"
                      />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto rounded-t-xl bg-white px-6 pb-4">
                  <nav className="mt-16 flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-4">
                          {navitems.map((item) => (
                            <li key={item.title}>
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-50 text-yellow-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-600',
                                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item.current
                                      ? 'text-yellow-600'
                                      : 'text-gray-400 group-hover:text-yellow-600',
                                    'size-6 shrink-0',
                                  )}
                                />
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </div>
      </nav>
    </div>
  );
}
