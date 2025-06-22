'use client';

import * as React from 'react';
import { CalendarDays, SquareTerminal } from 'lucide-react';

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
    {
      title: 'Calendar',
      url: '/admin/calendar/internal',
      icon: CalendarDays,
      isActive: true,
      items: [
        {
          title: 'Applications',
          url: '/admin/calendar/applications',
        },
        {
          title: 'Internal',
          url: '/admin/calendar/internal',
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
                <span className={`${logoFont.className} text-4xl`}>
                  <span>IB</span>
                  <span className="text-primaryColor">ZIM</span>
                </span>
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
