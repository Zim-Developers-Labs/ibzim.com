'use client';

import { DOMAIN_URLS } from '@/lib/constants';
import { logoFont } from '@/lib/fonts';
import { ArrowRight, Clock, Compass, Settings } from 'lucide-react';

export default function ContinuePageComponents({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
      <div className={`${logoFont.className} mb-4 text-4xl md:text-5xl`}>
        <span>IB</span>
        <span className="text-primaryColor">ZIM</span>
      </div>
      <p className="max-w-sm text-center text-zinc-600">
        Your account is ready. Choose how you&#39;d like to continue your
        journey.
      </p>
      <div className="mt-8 flex w-full max-w-4xl flex-col justify-between lg:flex-row">
        <div
          onClick={() => {
            window.location.href = '/my-account/general';
          }}
          className="group w-full cursor-pointer rounded-t-lg border border-b-0 border-zinc-200 bg-white px-4 py-8 lg:rounded-l-lg lg:rounded-tr-none lg:border-r-0 lg:border-b"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:items-start">
              <div className="bg-primaryColor/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-yellow-200">
                <Settings
                  className="text-primaryColor h-5 w-5"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="text-foreground mb-1 font-medium">
                  Manage Your Account
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Update your profile, security settings, and preferences
                </p>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-all group-hover:translate-x-1" />
          </div>
        </div>
        <div
          onClick={() => {
            window.location.href = DOMAIN_URLS.MAIN();
          }}
          className="group w-full cursor-pointer border border-b-0 border-zinc-200 bg-yellow-200 px-4 py-8 lg:border-r-0 lg:border-b"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:items-start">
              <div className="bg-primaryColor/10 group-hover:bg-accent flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors">
                <Compass
                  className="text-primaryColor h-5 w-5"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="text-foreground mb-1 font-medium">
                  Explore IBZIM Suite
                </h3>
                <p className="text-sm leading-relaxed text-zinc-700">
                  Discover all the powerful features available to you
                </p>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-all group-hover:translate-x-1" />
          </div>
        </div>
        <div
          onClick={() => {
            window.location.href = callbackUrl || DOMAIN_URLS.MAIN();
          }}
          className="group w-full cursor-pointer rounded-b-lg border border-zinc-200 bg-white px-4 py-8 lg:rounded-r-lg lg:rounded-bl-none"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:items-start">
              <div className="bg-primaryColor/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-yellow-200">
                <Clock
                  className="text-primaryColor h-5 w-5"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h3 className="text-foreground mb-1 font-medium">
                  Where You Left Off
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Return to what you were doing before signing up
                </p>
              </div>
            </div>
            <ArrowRight className="text-muted-foreground group-hover:text-foreground h-5 w-5 transition-all group-hover:translate-x-1" />
          </div>
        </div>
      </div>
      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          Need help getting started?{' '}
          <a
            href="https://wa.me/+263717238876"
            target="_blank"
            rel="nofollow"
            className="text-foreground hover:underline"
          >
            Contact&nbsp;Support
          </a>
        </p>
      </div>
    </div>
  );
}
