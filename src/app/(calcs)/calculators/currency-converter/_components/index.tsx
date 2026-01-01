import Container from '@/components/container';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { CurrencyConverter } from './calculator';
import { Button } from '@/components/ui/button';
import { ChevronDoubleDownIcon } from '@heroicons/react/16/solid';

export default function CurrencyConverterComponents() {
  return (
    <div className="bg-zinc-50">
      <Container className="py-12">
        <div className="mb-6">
          <div className="mb-4 flex gap-3 sm:items-center">
            <Avatar className="h-16 w-16 rounded-md border border-zinc-300">
              <AvatarImage
                src="/assets/calc-logos/zig.png"
                alt={`Zimbabwe Currency Converter ZiG`}
              />
            </Avatar>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">
                Zimbabwe Currency Converter
              </h1>
              <p className="text-muted-foreground">
                Convert currencies including ZiG, USD, ZWL, and ZAR with
                up-to-date official and unofficial exchange rates.
              </p>
              <Button className="md:hidden" asChild>
                <Link href="#rates">
                  Check Rates <ChevronDoubleDownIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto py-8 md:max-w-3xl">
          <CurrencyConverter />
        </div>
        <div className="mt-12">
          <div className="mb-3 text-lg font-semibold">Other Calculators</div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Link
              href="/calculators/zimbabwe-distance-table"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zinara.png"
                  alt={`Distance Table Calculator ZINARA logo`}
                />
              </Avatar>
              Distance Table
            </Link>
            <Link
              href="/calculators/ecocash-charges"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/ecocash.png"
                  alt={`ZiG and USD Ecocash Calculator logo`}
                />
              </Avatar>
              Ecocash Calculator
            </Link>
            <Link
              href="/calculators/zesa-units"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zesa.png"
                  alt={`ZESA logo`}
                />
              </Avatar>
              ZESA Calculator
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
