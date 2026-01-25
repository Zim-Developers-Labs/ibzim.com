'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RecoveryCodePageComponents({
  recoveryCode,
  callbackUrl,
}: {
  recoveryCode: string;
  callbackUrl?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy recovery code:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md border border-zinc-200 bg-white shadow-none">
        <CardHeader className="space-y-4 pb-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
            <Icons.brandedShield className="h-10 w-10 text-zinc-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Recovery Code Generated
            </CardTitle>
            <CardDescription className="leading-relaxed text-gray-600">
              Store this code in a secure location. You&#39;ll need it if you
              lose access to your authenticator device.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <div className="bg-muted/50 border-muted-foreground/20 rounded-lg border-2 border-dashed p-6 text-center">
              <div className="text-foreground font-mono text-xl font-semibold tracking-widest break-all">
                {recoveryCode}
              </div>
            </div>
            <Button
              variant={isCopied ? 'default' : 'outline'}
              size="sm"
              className={`absolute -top-2 -right-2 h-8 transition-all duration-200 ${
                isCopied
                  ? 'w-auto bg-green-600 px-2 text-white hover:bg-green-700'
                  : 'w-auto bg-white p-0'
              }`}
              onClick={handleCopy}
            >
              {isCopied ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  <span className="text-xs font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  <span className="text-xs font-medium">Copy</span>
                </>
              )}
              <span className="sr-only">
                {isCopied ? 'Recovery code copied' : 'Copy recovery code'}
              </span>
            </Button>
          </div>
          <Link
            href={callbackUrl || '/continue'}
            className="bg-primaryColor hover:bg-primaryColor/80 mx-auto block w-48 rounded-md py-2 text-center text-zinc-900"
          >
            Done
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
