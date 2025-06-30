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
    title: 'Profile Customization',
    description: 'Avatar, username, social links, country and city',
    current: false,
    href: '/user/settings/profile-customization',
    icon: (props: any) => (
      <svg
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
      >
        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 480c-47.24 0-91.04-14.78-127.2-39.84C132.9 390.9 173.8 352 224 352h64c50.25 0 91.14 38.94 95.21 88.16C347 465.2 303.2 480 256 480zM411.7 416.7C397.6 361.3 347.7 320 288 320H224c-59.73 0-109.6 41.3-123.7 96.72C58.27 375.1 32 319 32 256c0-123.5 100.5-224 224-224s224 100.5 224 224C480 319 453.7 375.1 411.7 416.7zM256 128C211.8 128 176 163.8 176 208C176 252.2 211.8 288 256 288s80-35.82 80-80C336 163.8 300.2 128 256 128zM256 256C229.5 256 208 234.5 208 208S229.5 160 256 160s48 21.53 48 48S282.5 256 256 256z" />
      </svg>
    ),
  },
  {
    title: 'Communications',
    description: 'Manage emails or whatsapp messages you want to receive',
    current: false,
    href: '/user/settings/communications',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 512 512" {...props}>
        <path d="M416 0c-7.125 0-14.19 2.375-19.97 7.031L311 75.06C268.3 109.2 214.7 128 160 128H64C28.66 128 0 156.7 0 192v96c0 35.34 28.66 64 64 64h96c54.66 0 108.3 18.81 150.1 52.94L396 472.1C400.8 476.8 409.8 480 416 480c24.91 0 32-22.78 32-32V32C448 23.25 441 0 416 0zM160 320H64c-17.64 0-32-14.36-32-32V192c0-17.64 14.36-32 32-32h96V320zM415.8 447.8L330.1 379.9C290.1 347.1 242.5 328.1 192 322.1V157.9c50.53-6.006 98.99-25.86 138.1-57.82l84.94-67.93c.0234 .0234-.0176 0 0 0c.0352 0-.0117 .0996 0 0l.1244 414.8C416 447.2 415.9 447.5 415.8 447.8zM191.7 383.5C191.4 374.7 184.3 368.2 175.2 368c-8.828 .2656-15.78 7.656-15.52 16.48c1.156 38 28.36 70.55 28.61 70.83c3.594 4.203 4.688 11.11 2.641 16.86C189.3 476.9 185.8 480 182.3 480H130.8C128.3 480 125.8 478.5 124 475.9c-1.188-1.672-29.05-41.7-27.97-91.58C96.22 375.5 89.22 368.2 80.38 368c-8.406-.25-16.16 6.828-16.34 15.66c-1.281 59.28 30.23 105.6 33.88 110.8C105.9 505.6 117.9 512 130.8 512h51.47c17.34 0 32.59-11.44 38.84-29.09c5.906-16.52 2.578-35.53-8.297-48.2C212.6 434.5 192.5 409.5 191.7 383.5zM496 192C487.2 192 480 199.2 480 208v64C480 280.8 487.2 288 496 288S512 280.8 512 272v-64C512 199.2 504.8 192 496 192z" />
      </svg>
    ),
  },
  {
    title: 'Account Security',
    description:
      'Manage your email, password and two-factor authetication (2FA)',
    current: false,
    href: '/user/settings/account-security',
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 512 512" {...props}>
        <path d="M466.5 83.69l-192-80.01C269.6 1.656 261.3 0 256.1 0C250.8 0 242.5 1.656 237.6 3.688l-192 80.01C27.69 91.08 16 108.6 16 127.1C16 385.2 205.2 512 255.1 512C307.1 512 496 383.8 496 127.1C496 108.6 484.3 91.08 466.5 83.69zM280 258.4V328c0 13.25-10.75 24-24 24s-24-10.75-24-24V258.4C213.1 249.4 200 230.3 200 208c0-30.93 25.07-56 56-56s56 25.07 56 56C312 230.3 298.9 249.4 280 258.4z" />
      </svg>
    ),
  },
] satisfies SettingsNavItem[];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsNav() {
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
            <div className="text-sm text-gray-600">Settings</div>
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
