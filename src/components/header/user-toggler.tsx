'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import {
  ArrowRightStartOnRectangleIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import { logout } from '@/lib/auth/actions';
import Image from 'next/image';
import { User } from 'lucia';
import { toast } from 'sonner';

type UserTogglerType = {
  user: User;
};

export default function UserToggler({ user }: UserTogglerType) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.info('Signed out successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };
  const fname = user.fullName ? user.fullName.split(' ')[0] : 'I';
  const lname = user.fullName ? user.fullName.split(' ')[1] : 'B';

  return (
    <div className="w-fit">
      <Menu>
        <MenuButton className="relative inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm/6 text-white">
          {user.avatar ? (
            <Image
              alt={user.fullName || ''}
              height={40}
              width={40}
              src={user.avatar}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <div className="bg-primaryColor grid h-6 w-6 place-content-center rounded-md text-xs uppercase">
              {fname[0]}
              {lname[0]}
            </div>
          )}
          <ChevronDownIcon className="size-4 fill-zinc-700" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="mt-4 w-64 origin-top-right rounded-xl border border-zinc-200 bg-white p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="px-2 py-4 text-xs">{user.email}</div>
          <MenuItem>
            <Link
              href={`/user/library/saved-articles`}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-zinc-100"
            >
              <BookmarkIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
              Saved Articles
              <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                ⌘G
              </kbd>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              href={`/user/library/comments`}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-zinc-100"
            >
              <ChatBubbleBottomCenterTextIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
              My Comments
              <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                ⌘G
              </kbd>
            </Link>
          </MenuItem>
          {/* <MenuItem>
            <Link
              href={`/user/achievements`}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-zinc-100"
            >
              <TrophyIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
              My Achievements
              <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                ⌘F
              </kbd>
            </Link>
          </MenuItem> */}
          <MenuItem>
            <Link
              href={`/user/settings/profile-customization`}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-zinc-100"
            >
              <Cog6ToothIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4 text-black" />
              Account Settings
              <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </Link>
          </MenuItem>
          <div className="my-1 h-px bg-black/5" />
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-zinc-100"
              onClick={open}
            >
              <ArrowRightStartOnRectangleIcon className="size-4 text-black/30" />
              Logout
              <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                ⌘A
              </kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/70">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium">
                Sign Out of IBZIM?
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-black/50">
                You will be redirected to the home page
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  className="inline-flex items-center gap-2 rounded-md border border-gray-400 px-3 py-1.5 text-sm/6 font-semibold focus:outline-none data-[hover]:bg-gray-100"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[hover]:bg-gray-600 data-[open]:bg-gray-700"
                  onClick={handleSignout}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing' : 'Sign Out'}
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
