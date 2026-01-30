'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, WifiOff } from 'lucide-react';

export default function FailedFetchComponent() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center p-6">
      <WifiOff className="text-muted-foreground h-12 w-12" />
      <h1 className="text-foreground mt-6 text-xl font-semibold">
        Connection Error
      </h1>
      <p className="text-muted-foreground mt-2 text-center">
        We couldn't reach our servers. Check your network and try again.
      </p>
      <p className="text-muted-foreground mt-4 text-sm">
        Still having issues?{' '}
        <a
          href={`https://wa.me/+263717238876?text=I am having trouble accessing ibzim.com search feature. Please assist.`}
          className="text-foreground hover:text-foreground/80 underline underline-offset-4"
        >
          Contact us
        </a>
      </p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-6"
        variant="outline"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
