'use client';

import * as React from 'react';
import { SquareTerminal } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { logoFont } from '@/lib/fonts';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import Link from 'next/link';

const data = {
  user: {
    name: 'ibuser',
    email: 'admin@ibglobal.org',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Blog',
      url: '/admin/dashboard',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Articles',
          url: '/admin/articles',
        },
        {
          title: 'Profiles',
          url: '/admin/profiles',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <span className={`${logoFont.className}`}>
                    <span>I</span>
                    <span className="text-primaryColor">B</span>
                  </span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">IB Global</span>
                  <span className="truncate text-xs tracking-wide">
                    Quality over Quantity
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
