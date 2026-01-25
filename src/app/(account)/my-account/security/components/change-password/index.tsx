'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DOMAIN_URLS } from '@/lib/constants';
import { User } from '@/lib/server/constants';
import { ExternalLink, Lock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ChangePasswordForm({
  user,
}: {
  user: User;
  updateUser: (user: Partial<User>) => void;
}) {
  const isGoogleUser = Boolean(user.googleId);
  const googleId = user.googleId;

  return (
    <Card className="rounded-md shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">Manage Password</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {user.googleId
                ? 'Your account is linked with Google'
                : 'Change or reset your account password'}
            </p>
          </div>

          <div className="relative ml-4">
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent"
              disabled={googleId !== null}
              onClick={() => {
                if (!isGoogleUser) {
                  window.open(`/reset-password`, '_self');
                }
              }}
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              Reset
            </Button>
            {isGoogleUser && (
              <div className="bg-background/60 absolute inset-0 flex items-center justify-center rounded-md backdrop-blur-[2px]">
                <Lock className="text-muted-foreground h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        {googleId !== null ? (
          <Button
            size="sm"
            variant="outline"
            className="mt-2 gap-2 bg-transparent"
            onClick={async () => {
              // const response = await removeGoogleId(googleId);

              // if (response.error) {
              //   toast.error(response.error);
              // } else {
              //   toast.success('Your account has been unlinked with Google');
              //   updateUser({
              //     googleId: null,
              //   });
              // }
              toast.info(
                'Switching from Google Sign-In to password authentication is currently disabled.',
              );
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Dissociate my Google account
          </Button>
        ) : (
          <>
            <p className="text-sm">*****************</p>
            <Link
              href={`/forgot-password`}
              className="text-primaryColor text-sm"
            >
              Forgot password?
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
