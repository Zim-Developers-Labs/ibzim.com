'use client';

import { VoteIcon } from 'lucide-react';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import AwardsHero from './hero';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentSeason } from '../[category]/vote/[titleId]/components/constants';
import FAQSection from './faq';

export default function AwardsPageComponent() {
  const selectedYear = new Date().getFullYear();

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-900 px-4 pt-28 pb-48 text-white sm:px-6">
        <svg
          viewBox="0 0 1208 1024"
          aria-hidden="true"
          className="absolute -bottom-48 left-1/2 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-20 lg:-top-0 lg:bottom-auto lg:translate-y-0"
        >
          <ellipse
            cx={604}
            cy={512}
            rx={604}
            ry={512}
            fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)"
          />
          <defs>
            <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
              <stop stopColor="#EAB308" />
              <stop offset={1} stopColor="#FF5A5A" />
            </radialGradient>
          </defs>
        </svg>
        <Icons.ibzimAwardsIcon className="mx-auto mb-6 block h-12 w-12 text-white" />
        <span className="from-secondaryColor via-primaryColor to-secondaryColor block bg-gradient-to-t bg-clip-text text-center tracking-widest text-transparent">
          {currentSeason.name} {selectedYear}
        </span>
        <h1 className="my-4">
          <span className="block text-center text-4xl tracking-wide">
            People&#39;s Choice <span className="font-light">Awards</span>
          </span>
        </h1>
        <p className="mx-auto mb-20 max-w-xl text-center font-light">
          Celebrating Zimbabwean excellence across different industries while
          rewarding both winners and voters.
        </p>
        <div className="absolute left-1/2 mx-auto mt-12 w-fit -translate-x-1/2 -translate-y-20">
          <Tabs value="voting">
            <TabsList>
              <TabsTrigger
                value="voting"
                className="cursor-pointer px-4 data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
                asChild
              >
                <Link href="#">
                  Start Voting <VoteIcon />
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="guides"
                className="data-[state=active]:bg-primaryColor cursor-pointer px-4 data-[state=active]:text-white"
                asChild
              >
                <Link href="#">Read Guides</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      <AwardsHero />
      <FAQSection />
    </>
  );
}
