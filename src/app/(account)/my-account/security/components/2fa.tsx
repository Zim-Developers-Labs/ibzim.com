'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DOMAIN_URLS } from '@/lib/constants';
import type { User } from '@/lib/server/constants';
import { AlertCircleIcon } from 'lucide-react';
import { useState } from 'react';

export default function TwoFactorComponent({ user }: { user: User }) {
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  return (
    <>
      <Card className="rounded-md shadow-none">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authenticator App</p>
              <p className="text-muted-foreground text-sm">
                Use an app like Google Authenticator
              </p>
            </div>
            {user.registered2FA ? (
              <Badge variant="default" className="bg-green-600">
                Enabled
              </Badge>
            ) : (
              <Badge variant="destructive">Not Enabled</Badge>
            )}
          </div>
          {user.registered2FA ? (
            <Button
              variant="destructive"
              onClick={() => setShowDisableDialog(true)}
            >
              Disable 2FA
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => {
                window.open(`/2fa/setup`, '_self');
              }}
            >
              Enable 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="flex flex-col md:flex-row">
          <div className="mx-auto flex h-12 w-12 min-w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircleIcon className="text-primaryColor h-6 w-6" />
          </div>
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                You can&#39;t make this change at the moment
              </DialogTitle>
              <DialogDescription className="space-y-4 pt-2">
                <span className="block">
                  This is because we noticed your session is secured and we need
                  to keep your account safe.
                </span>
                <span className="block">
                  We&#39;ll allow you to make this change when you have an
                  unverified session on protected pages.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-primaryColor hover:bg-primaryColor/90"
                onClick={() => setShowDisableDialog(false)}
              >
                Okay
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
