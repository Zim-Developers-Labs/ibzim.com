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
import { BellIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to your new notification inbox',
      description:
        'This is your new notification inbox, where you can view all notifications sent to this account. Comment replies, likes & new articles will be noted here.',
      timestamp: '40 minutes ago',
      isRead: false,
    },
    {
      id: '2',
      title: 'Follow us on Instagram',
      description:
        'Follow us on Instagram to stay updated with the latest news and updates.',
      timestamp: '50 minutes ago',
      isRead: false,
      actionButton: {
        text: 'Check it out',
        onClick: () => window.open('https://instagram.com/ibzimblog', '_blank'),
      },
    },
  ]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
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
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadNotifications.length}
            </span>
          )}
          <BellIcon className="h-5 w-5" />
          <span className="hidden md:inline">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full max-w-[350px] flex-col sm:w-[540px]">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle>My Notifications</SheetTitle>
          </div>
          <SheetDescription>
            Notifications sent to this inbox can be viewed for up to 30 days.
          </SheetDescription>
        </SheetHeader>
        <Tabs
          defaultValue="unread"
          className="flex min-h-0 flex-1 flex-col px-4 md:px-6"
        >
          <TabsList className="grid w-full flex-shrink-0 grid-cols-2">
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadNotifications.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                  {unreadNotifications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          <TabsContent value="unread" className="mt-4 flex-1 overflow-y-auto">
            <div className="space-y-4 pr-2">
              {unreadNotifications.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  No unread notifications
                </p>
              ) : (
                unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                          {notification.timestamp}
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs text-yellow-600 hover:text-yellow-800"
                          onClick={() => markAsRead(notification.id)}
                        >
                          ✓ Mark as read
                        </Button>
                      </div>
                    </div>
                    <div className="mb-2">
                      <h3 className="text-sm font-medium">
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      {notification.description}
                    </p>
                    {notification.actionButton && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={notification.actionButton.onClick}
                      >
                        {notification.actionButton.text}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="read" className="mt-4 flex-1 overflow-y-auto">
            <div className="space-y-4 pr-2">
              {readNotifications.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  No read notifications
                </p>
              ) : (
                readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="border-b pb-4 opacity-75 last:border-b-0"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-sm font-medium">
                        {notification.title}
                      </h3>
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      {notification.description}
                    </p>
                    {notification.actionButton && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={notification.actionButton.onClick}
                      >
                        {notification.actionButton.text}
                      </Button>
                    )}
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
