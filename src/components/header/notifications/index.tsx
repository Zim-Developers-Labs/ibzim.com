'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Bell, BellIcon, Coins, InfoIcon, MessageSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { renderNotification } from './variations';
import { NotificationType } from '@/types';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { DOMAIN_URLS } from '@/lib/constants';

export function Notifications({
  sanityGlobalNotifications,
  neonUserNotifications,
  user,
}: {
  sanityGlobalNotifications?: NotificationType[];
  neonUserNotifications?: NotificationType[];
  user?: any;
}) {
  const [userNotifications, setUserNotifications] = useState<
    NotificationType[]
  >((neonUserNotifications || []).map((n) => ({ ...n, from: 'neon' })));
  const [globalNotifications, setGlobalNotifications] = useState<
    NotificationType[]
  >((sanityGlobalNotifications || []).map((n) => ({ ...n, from: 'sanity' })));

  const unreadUserNotifications = userNotifications.filter((n) => !n.isRead);
  const readUserNotifications = userNotifications.filter((n) => n.isRead);
  const unreadGlobalNotifications = globalNotifications.filter(
    (n) => !n.isRead,
  );
  const readGlobalNotifications = globalNotifications.filter((n) => n.isRead);

  const readNotifications = [
    ...readUserNotifications,
    ...readGlobalNotifications,
  ];

  const markAsRead = (id: string) => {
    setUserNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
    setGlobalNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative cursor-pointer border-zinc-600 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
        >
          {(unreadGlobalNotifications.length > 0 ||
            unreadUserNotifications.length > 0) && (
            <span
              className={`absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-green-500 text-xs text-white ${unreadUserNotifications.length > 0 ? 'h-4 w-4' : 'h-3 w-3'}`}
            >
              {unreadUserNotifications.length > 0
                ? unreadUserNotifications.length
                : ''}
            </span>
          )}
          <BellIcon className="h-5 w-5" />
          <span className="hidden md:inline">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full max-w-[350px] flex-col sm:w-[540px]">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
          </div>
          <SheetDescription>
            Notifications sent to this inbox can be viewed for up to 30 days.
          </SheetDescription>
        </SheetHeader>
        <Tabs
          defaultValue={
            unreadUserNotifications.length > 0 ? 'yours' : 'general'
          }
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="px-4">
            <TabsList className="grid w-full flex-shrink-0 grid-cols-3 gap-2 rounded-sm">
              <TabsTrigger
                value="yours"
                className="relative cursor-pointer rounded-sm hover:bg-yellow-100"
              >
                Yours
                {unreadUserNotifications.length > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                    {unreadUserNotifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="general"
                className="relative cursor-pointer rounded-sm hover:bg-yellow-100"
              >
                General
                {unreadGlobalNotifications.length > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                    {unreadGlobalNotifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="seen"
                className="relative cursor-pointer rounded-sm hover:bg-yellow-100"
              >
                Archive
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="yours" className="mt-4 flex-1 overflow-y-auto">
            {user ? (
              <div className="">
                {unreadUserNotifications.length === 0 ? (
                  <Card className="border-0 p-6 shadow-none">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 rounded-full bg-zinc-100 p-3">
                        <Bell
                          className="text-primary h-8 w-8"
                          strokeWidth={1}
                        />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        All caught up!
                      </h3>
                      <p className="text-muted-foreground mb-6 text-sm text-balance">
                        You&#39;re all up to date. Why not engage with the
                        community while you&#39;re here?
                      </p>

                      <div className="mx-auto flex w-full max-w-[250px] flex-col gap-2">
                        <Link
                          href="/articles"
                          className="bg-primaryColor hover:bg-primaryColor/80 flex w-full items-center justify-start gap-2 rounded-md py-1.5 pl-4 text-sm text-white"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Comment on Articles
                        </Link>
                        <Link
                          href="/zimbabwe-peoples-choice-awards"
                          className="flex w-full items-center justify-start gap-2 rounded-md border border-zinc-200 py-1.5 pl-4 text-sm hover:bg-zinc-100"
                        >
                          <Icons.ibzimAwardsIcon className="text-primaryColor h-4 w-4" />
                          Vote for Favourites
                        </Link>
                        <Link
                          href={DOMAIN_URLS.EARN()}
                          target="_blank"
                          className="flex w-full items-center justify-start gap-2 rounded-md border border-zinc-200 py-1.5 pl-4 text-sm hover:bg-zinc-100"
                        >
                          <Coins className="text-primaryColor h-4 w-4" />
                          Earn some Money
                        </Link>
                      </div>
                    </div>
                  </Card>
                ) : (
                  unreadUserNotifications.map((notification) =>
                    renderNotification(notification, markAsRead),
                  )
                )}
              </div>
            ) : (
              <div className="text-muted-foreground px-4 py-8 text-center">
                <InfoIcon className="mr-2 inline h-4 w-4" />
                Sign in to view personalized notifications.
              </div>
            )}
          </TabsContent>
          <TabsContent value="general" className="mt-4 flex-1 overflow-y-auto">
            <div className="">
              {unreadGlobalNotifications.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  No unread notifications
                </p>
              ) : (
                unreadGlobalNotifications.map((notification) =>
                  renderNotification(notification, markAsRead),
                )
              )}
            </div>
          </TabsContent>
          <TabsContent value="seen" className="mt-4 flex-1 overflow-y-auto">
            <div className="">
              {readNotifications.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  No read notifications
                </p>
              ) : (
                readNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="border-b px-4 py-4 opacity-75 last:border-b-0 md:px-6"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {notification._createdAt}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      {notification.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
