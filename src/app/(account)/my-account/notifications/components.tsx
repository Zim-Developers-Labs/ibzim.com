'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Mail, Bell } from 'lucide-react';

export default function NotificationsComponents() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  return (
    <div className="space-y-8 md:min-w-md">
      <Card className="rounded-md shadow-none">
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Account Updates</p>
                <p className="text-muted-foreground text-sm">
                  Security alerts and account changes
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-muted-foreground text-sm">
                  Real-time notifications on your devices
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, push: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-muted-foreground text-sm">
                  Product updates and promotional content
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, marketing: checked }))
              }
            />
          </div>

          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
