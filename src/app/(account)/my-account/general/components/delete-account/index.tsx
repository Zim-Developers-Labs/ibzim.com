'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DOMAIN_URLS } from '@/lib/constants';
import { User } from '@/lib/server/constants';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { createEmailVerificationRequest } from './actions';

export default function DeleteAccountField({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    await createEmailVerificationRequest(user.id, user.email);
    window.open(`/confirm-delete`, '_self');
  };

  return (
    <Card className="border-destructive/20 rounded-md shadow-none">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible account actions</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Your Account
              </DialogTitle>
              <DialogDescription>
                This action will permanently delete your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription className="space-y-2 text-sm">
                  <p>Once deleted, you will lose access to:</p>
                  <ul className="ml-2 list-inside list-disc space-y-1">
                    <li>Your profile and account settings</li>
                    <li>Unclaimed rewards & Peya Peya Points</li>
                    <li>Saved preferences and data</li>
                  </ul>
                  <p className="mt-2 font-medium">
                    Your public posts will be anonymized and remain visible.
                  </p>
                </AlertDescription>
              </Alert>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) =>
                    setConfirmed(checked as boolean)
                  }
                />
                <label
                  htmlFor="confirm"
                  className="text-sm leading-none tracking-wide peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand that my account will be{' '}
                  <span className="font-medium text-red-500">permanently</span>{' '}
                  deleted and this action cannot be undone.
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!confirmed || isLoading}
                onClick={() => {
                  setIsLoading(true);
                  handleDelete();
                }}
              >
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
