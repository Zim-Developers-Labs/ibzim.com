import { Card, CardContent } from '@/components/ui/card';
import BetaContainer from '../../container';
import { CheckCircle, DollarSign, InfoIcon, TrendingUp } from 'lucide-react';
import { stats } from './data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import FeaturesTable from './features-table';

export default function BetaPageComponents() {
  return (
    <main className="relative overflow-x-hidden">
      <div className="screen-line-after h-6 border-y border-zinc-200 before:absolute before:-z-1 before:h-6 before:w-screen before:bg-[repeating-linear-gradient(315deg,var(--color-zinc-300)_0,var(--color-zinc-300)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px]" />
      <div className="bg-zinc-50 pb-10">
        <BetaContainer className="min-h-screen pt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-zinc-200 bg-white shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase">
                      Issues Reported
                    </p>
                    <p className="mt-1 text-2xl font-bold text-red-600">
                      {stats.issuesSubmitted.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <TrendingUp className="size-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 bg-white shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase">
                      Issues Fixed
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                      {stats.issuesResolved.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="size-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 bg-white shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase">
                      Funds Raised
                    </p>
                    <p className="mt-1 text-2xl font-bold text-zinc-900">
                      US${stats.fundingRaised.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                    <DollarSign className="size-5 text-zinc-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 bg-zinc-900 shadow-none">
              <CardContent className="p-4">
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
                  No Signup required. Jump right into clicking buttons to be
                  part of the program.
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
  );
}
