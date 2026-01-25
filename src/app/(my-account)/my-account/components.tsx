'use client';

import { Card, CardContent } from '@/components/ui/card';
import { logoFont } from '@/lib/fonts';
import { User, Settings, Shield, Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeComponents() {
  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal information and profile settings',
      href: '/my-account/profile',
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: Settings,
      description: 'Account preferences and settings',
      href: '/my-account/general',
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password and authentication settings',
      href: '/my-account/security',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email and push notification preferences',
      href: '/my-account/notifications',
    },
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="space-y-4 p-4">
        <div className="mb-6 text-center">
          <h1 className="mb-4">
            <span
              className={`${logoFont.className} mb-4 block text-4xl lg:text-5xl`}
            >
              <span>IB</span>
              <span className="text-primaryColor">ZIM</span>
            </span>
            <span className="text-2xl text-balance lg:text-3xl">
              Account Center
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>

        <div className="mx-auto max-w-xl space-y-3">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isFirst = index === 0;
            const isLast = index === sidebarItems.length - 1;

            return (
              <Link key={item.id} href={item.href}>
                <Card
                  className={`hover:bg-accent/50 cursor-pointer shadow-none transition-colors ${isFirst ? 'rounded-t-xl rounded-b-none' : ''} ${isLast ? 'rounded-t-none rounded-b-xl' : ''} ${!isFirst && !isLast ? 'rounded-none' : ''} ${!isFirst ? 'border-t-0' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg p-2">
                          <Icon
                            className="text-primary h-5 w-5"
                            strokeWidth={1.5}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="text-muted-foreground h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
