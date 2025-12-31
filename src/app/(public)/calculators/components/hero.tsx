'use client';

import Container from '@/components/container';
import { Button } from '@/components/ui/button';
import { ChevronDoubleDownIcon } from '@heroicons/react/16/solid';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorsHero() {
  return (
    <section className="from-primaryColor/30 via-secondaryColor/5 bg-gradient-to-b to-transparent pb-8 md:pb-10">
      <div className="bg-primaryColor/10 w-full border-b border-b-gray-200">
        <Container className="line-clamp-1 flex max-w-screen-xl items-center justify-center text-[.8rem] leading-8">
          <Info className="mr-1 inline size-4" />
          Whatsapp +263717238876 for support
        </Container>
      </div>
      <Container className="max-w-screen-md pt-10 pb-10 md:pt-20">
        <div className="flex flex-col items-start gap-6 text-left md:items-center md:text-center">
          <h1 className="text-3xl font-bold text-balance md:text-5xl">
            Zimbabwe Calculators
          </h1>
          <p className="mx-auto max-w-2xl text-base text-pretty opacity-90 md:text-lg">
            Free online tools to help you calculate EcoCash charges, ZESA units,
            travel costs, currency conversions and more.
          </p>
          <div className="mt-4 flex items-center gap-3 md:gap-4">
            <Button
              onClick={() => {
                window.open(
                  `https://wa.me/+263717238876?text=${encodeURI('Hi IBZIM team, I would like to request the following calculator:')}`,
                  '_blank',
                );
              }}
              className="rounded-md"
              variant="outline"
            >
              Request Calculator
            </Button>
            <Button
              className="bg-primaryColor hover:bg-primaryColor/90 rounded-md text-black"
              asChild
            >
              <Link href="/calculators#calculators-listing">
                View Calculators
                <ChevronDoubleDownIcon className="inline h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
