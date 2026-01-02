'use client';

import { Button } from '@/components/ui/button';
import {
  UserIcon,
  Settings,
  Shield,
  Bell,
  ChevronLeftCircle,
  Info,
  Grip,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActionState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { logoFont } from '@/lib/fonts';
import { User } from '@/lib/server/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { SubmitButton } from '@/components/ui/submit-button';
import { MenuDrawer } from './menu-drawer';
import { useUser } from '@/hooks/user-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logoutAction } from '@/lib/logout';

interface AccountLayoutProps {
  children: ReactNode;
}

const initialState = {
  message: '',
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const [, action] = useActionState(logoutAction, initialState);

  const pathname = usePathname();

  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: UserIcon,
      href: '/my-account/profile',
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: Settings,
      href: '/my-account/general',
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      href: '/my-account/security',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/my-account/notifications',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Mobile Header */}
      <div className="bg-card border-border sticky top-3 right-0 left-0 z-50 mx-4 rounded-md border lg:hidden">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-4">
            <Link href="/" className="block">
              <ChevronLeftCircle
                className="h-6 w-6 text-zinc-700"
                strokeWidth={1.5}
              />
            </Link>
            <h1>
              <span className={`${logoFont.className} -mb-2 block text-3xl`}>
                <span>IB</span>
                <span className="text-primaryColor">ZIM</span>
              </span>
              <span className="text-xs text-zinc-600">ACCOUNT CENTER</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <MenuDrawer>
              <Button
                variant="outline"
                className="relative cursor-pointer border-zinc-200 bg-transparent hover:bg-zinc-100"
              >
                <Grip className="h-5 w-5" />
                <span className="">Menu</span>
              </Button>
            </MenuDrawer>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-yellow-400 bg-yellow-200 hover:bg-yellow-300">
                  <Avatar className="h-10 w-10 cursor-pointer border border-yellow-400 bg-yellow-200 hover:bg-yellow-300">
                    {user.avatar && <AvatarImage src={user.avatar} />}
                    <AvatarFallback className="text-sm text-yellow-900">
                      {user.fullName.split(' ')[0][0]}
                      {user.fullName.split(' ')[1][0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-[280px] p-4" align="start">
                <DropdownMenuLabel className="flex items-center text-sm">
                  <Info className="mr-2 inline h-4 w-4" />
                  <span className="block">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mb-4" />
                <form action={action} className="flex justify-center">
                  <SubmitButton
                    variant="outline"
                    className="cursor-pointer text-sm"
                  >
                    Logout
                  </SubmitButton>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative mx-auto flex gap-8 py-12 lg:w-fit">
        <div className="sticky top-4 hidden h-fit w-64 space-y-4 lg:block">
          <div className="bg-card h-fit w-full rounded-lg border border-zinc-200 p-6">
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className="block">
                <h1>
                  <span
                    className={`${logoFont.className} block text-2xl lg:text-3xl`}
                  >
                    <span>IB</span>
                    <span className="text-primaryColor">ZIM</span>
                  </span>
                  <span className="-mt-1 block text-lg text-balance lg:text-xs">
                    ACCOUNT CENTER
                  </span>
                </h1>
              </Link>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-yellow-400 bg-yellow-200 hover:bg-yellow-300">
                      <Avatar className="h-10 w-10 cursor-pointer border border-yellow-400 bg-yellow-200 hover:bg-yellow-300">
                        {user.avatar && <AvatarImage src={user.avatar} />}
                        <AvatarFallback className="text-sm text-yellow-900">
                          {user.fullName.split(' ')[0][0]}
                          {user.fullName.split(' ')[1][0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="max-w-[280px] p-4"
                    align="start"
                  >
                    <DropdownMenuLabel className="flex items-center text-sm">
                      <Info className="mr-2 inline h-4 w-4" />
                      <span className="block">{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="mb-4" />
                    <form action={action} className="flex justify-center">
                      <SubmitButton
                        variant="outline"
                        className="cursor-pointer text-sm"
                      >
                        Logout
                      </SubmitButton>
                    </form>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.id} href={item.href} className="block">
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
          <MenuDrawer>
            <div className="bg-card flex h-fit w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 px-6 py-2 hover:bg-zinc-100">
              <Grip className="h-5 w-5" />
              <span className="text-sm">Menu</span>
            </div>
          </MenuDrawer>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="max-w-4xl px-4 lg:px-0">
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
