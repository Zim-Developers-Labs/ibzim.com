'use client';

import { Card, CardContent } from '@/components/ui/card';
import BetaContainer from '../../container';
import { CheckCircle, DollarSign, InfoIcon, TrendingUp } from 'lucide-react';
import { features, stats } from './data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import FeaturesTable from './features-table';
import { useEffect, useState } from 'react';
import WelcomeGuideDialog from '../../welcome-guide';
import BetaBanner from '../../banner';
import BetaHeader from '../../header';

export default function BetaPageComponents() {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  // Check if user is new on component mount
  useEffect(() => {
    // Check localStorage to see if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedDashboard');

    if (hasVisited === 'true') {
      localStorage.setItem('hasVisitedDashboard', 'true');
    }

    if (hasVisited === 'false' || hasVisited === null) {
      setShowWelcomeDialog(true);
      localStorage.setItem('hasVisitedDashboard', 'true');
    }
  }, []);

  return (
    <>
      <BetaBanner setShowWelcomeDialog={setShowWelcomeDialog} />
      <BetaHeader />
      <WelcomeGuideDialog
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
      />
      <main className="relative overflow-x-hidden">
        <div className="screen-line-after h-6 border-y border-zinc-200 before:absolute before:-z-1 before:h-6 before:w-screen before:bg-[repeating-linear-gradient(315deg,var(--color-zinc-300)_0,var(--color-zinc-300)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px]" />
        <div className="bg-zinc-50 pb-10">
          <BetaContainer className="min-h-screen pt-8">
            <div className="grid grid-cols-3 gap-y-4 sm:gap-4 lg:grid-cols-4">
              <Card className="rounded-r-none border-r-0 border-zinc-200 bg-white shadow-none sm:rounded-r-xl lg:border-r">
                <CardContent className="sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase">
                        <span className="hidden sm:inline">Issues</span>{' '}
                        Reported
                      </p>
                      <p className="mt-1 text-2xl font-bold text-red-600">
                        {features.reduce((t, f) => t + f.issues.length, 0)}
                      </p>
                    </div>
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-red-100 sm:flex">
                      <TrendingUp className="size-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-none border-zinc-200 bg-white shadow-none sm:rounded-xl">
                <CardContent className="sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase">
                        <span className="hidden sm:inline">Issues</span> Fixed
                      </p>
                      <p className="mt-1 text-2xl font-bold text-emerald-600">
                        {features.reduce(
                          (total, feature) =>
                            total +
                            feature.issues.filter(
                              (issue) => issue.status === 'closed',
                            ).length,
                          0,
                        )}
                      </p>
                    </div>
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-emerald-100 sm:flex">
                      <CheckCircle className="size-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-l-none border-l-0 border-zinc-200 bg-white shadow-none sm:rounded-l-xl sm:border-l">
                <CardContent className="sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-zinc-500 uppercase">
                        <span className="hidden sm:inline">Funds</span> Raised
                      </p>
                      <p className="mt-1 text-2xl font-bold text-zinc-900">
                        <span className="hidden sm:inline">US</span>$
                        {stats.fundingRaised.current.toLocaleString()}
                      </p>
                    </div>
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-zinc-100 sm:flex">
                      <DollarSign className="size-5 text-zinc-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3 border-zinc-200 bg-zinc-900 shadow-none lg:col-span-1">
                <CardContent className="lg:p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src="/assets/calvin.webp"
                        alt="Calvin | IBZIM CTO"
                      />
                      <AvatarFallback>CB</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-white">
                      Visit{' '}
                      <Link href="/" className="text-primaryColor">
                        ibzim.com
                      </Link>{' '}
                      and make Calvin our CTO happy!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside
              className="mx-auto my-8 w-full overflow-hidden rounded-md bg-white"
              role="banner"
            >
              <div className="relative isolate flex items-center justify-start gap-x-2 overflow-hidden bg-yellow-500/50 px-6 py-4 sm:px-3.5 md:gap-x-6">
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                >
                  <div
                    style={{
                      clipPath:
                        'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                    className="to-primaryColor aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] opacity-50"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                >
                  <div
                    style={{
                      clipPath:
                        'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                    className="to-primaryColor aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] opacity-30"
                  />
                </div>
                <div className="flex items-start gap-x-2 sm:items-center sm:gap-x-4">
                  <div>
                    <InfoIcon className="size-4 text-zinc-900" />
                  </div>
                  <p className="-mt-1 text-sm text-zinc-900 sm:-mt-0">
                    Go to the ibzim.com homepage to tryout these features.
                  </p>
                </div>
              </div>
            </aside>

            {/* 
        
        Table listing all features in a row
        
        - Feature Status (Colored Icon + Text)
        - Feature Name
        - Feature Docs Link Button
        - Rate Feature Button (opens a dialog with form)
        - Report Bug on Feature Button (opens a dialog with form)

        */}

            <FeaturesTable />

            {/* Thank You card with Make suggestion CTA */}
          </BetaContainer>
        </div>
      </main>
    </>
  );
}
