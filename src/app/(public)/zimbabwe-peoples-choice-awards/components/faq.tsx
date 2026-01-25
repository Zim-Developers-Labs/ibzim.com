import { Icons } from '@/components/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function FAQSection() {
  return (
    <main className="min-h-screen bg-zinc-800 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header Section */}
        <div className="my-12 flex flex-col items-center text-center">
          <div className="mb-6 text-amber-400">
            <Icons.ibzimAwardsIcon className="h-12 w-12" />
          </div>
          <h1 className="mb-4 text-3xl text-balance text-zinc-50 md:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="text-sm tracking-widest text-zinc-400 uppercase">
            Everything you need to know
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem
            value="item-1"
            className="rounded-lg border border-zinc-600 bg-zinc-900/50 px-6"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="font-semibold text-zinc-100">
                How is the prize pool money raised?
              </span>
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-zinc-300">
              The prize pool money is raised from sponsors and mostly from the
              IBZIM Community who uses the platform daily.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="rounded-lg border border-zinc-600 bg-zinc-900/50 px-6"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="font-semibold text-zinc-100">
                What are the prizes for voters?
              </span>
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-zinc-300">
              <ul className="space-y-4">
                <li className="flex gap-2">
                  <span className="mt-1 text-amber-400">•</span>
                  <span>
                    Users who have winning votes across all titles of each award
                    category (Music, Comedy, Tech etc) will get IBZIM premium
                    subscription for 2 months + 1000 Impact points + a cash
                    reward which will depend on the total prize pool.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 text-amber-400">•</span>
                  <span>
                    Users who have winning votes on all main titles of each
                    award category will get IBZIM premium for a month + 500
                    Impact Points.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 text-amber-400">•</span>
                  <span>
                    Users who get at least 1 winning vote on any title of each
                    award category will get 100 Impact Points.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 text-amber-400">•</span>
                  <span>
                    For each winning vote every user will get 10 Impact Points.
                  </span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="rounded-lg border border-zinc-600 bg-zinc-900/50 px-6"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="font-semibold text-zinc-100">
                What are the prizes for nominees?
              </span>
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-zinc-300">
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>1st place gets 50% of the prize pool</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>2nd place gets 35% of the prize pool</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>3rd place gets 15% of the prize pool</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Alert Notice */}

        <Alert
          variant="default"
          className="relative mx-auto mt-6 mb-24 max-w-4xl overflow-hidden border-0 bg-zinc-900 py-8 text-white"
        >
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-yellow-500/20 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-yellow-400/15 blur-3xl" />

          <AlertCircle className="relative z-10 h-4 w-4" />
          <AlertDescription className="relative z-10 text-zinc-300">
            <strong className="font-semibold text-amber-400">
              FULL DISCLOSURE
            </strong>{' '}
            <span>
              Every nominee (person only, works differently for other entity
              types e.g businesses and schools) can earn money on IBZIM by
              claiming{' '}
              <Link href="/profiles" className="text-amber-400 underline">
                their profile
              </Link>
              .
            </span>
          </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
