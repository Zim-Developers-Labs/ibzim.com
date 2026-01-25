import Container from '@/components/container';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDoubleDownIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import ZesaCalculator from './calculator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How are ZESA electricity tariffs calculated?',
    answer:
      'ZESA uses a tiered tariff system where the cost per unit increases as your consumption rises. The first 50 units are charged at the lowest rate, with subsequent tiers (51-100, 101-200, 201-300, 300+) charged at progressively higher rates.',
  },
  {
    question:
      "What is the difference between 'First Time This Month' and 'Not the First Time'?",
    answer:
      "If it's your first purchase of the month, you'll be charged the base tariff which includes fixed charges. Subsequent purchases within the same month don't include these base charges, so you get slightly more units for the same amount.",
  },
  {
    question: 'Why are there different rates for USD and ZWG?',
    answer:
      'ZESA offers payments in both US Dollars (USD) and Zimbabwe Gold (ZWG). The ZWG rates are based on the official exchange rate and may differ from USD rates due to currency fluctuations.',
  },
  {
    question: 'How often do ZESA tariffs change?',
    answer:
      'ZESA tariffs are regulated by the Zimbabwe Energy Regulatory Authority (ZERA) and may be adjusted periodically based on economic conditions, inflation, and operational costs. Always check for the latest rates.',
  },
  {
    question: 'Are these calculations accurate?',
    answer:
      'This calculator provides estimates based on published ZESA tariff rates. Actual charges may vary slightly due to additional levies, taxes, or rate changes. Always verify with your official ZESA statement.',
  },
];

export default function ZesaUnitsComponents() {
  return (
    <main className="bg-zinc-50">
      <Container className="py-12">
        <div className="mb-6">
          <div className="mb-4 flex gap-3 sm:items-center">
            <Avatar className="h-16 w-16 rounded-md border border-zinc-300">
              <AvatarImage
                src="/assets/calc-logos/zesa.png"
                alt={`ZESA Units and Cost Calculator`}
              />
            </Avatar>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">
                ZESA Units and Cost Calculator
              </h1>
              <p className="text-muted-foreground">
                Calculate ZESA electricity consumption in units and cost for
                residential and commercial users in Zimbabwe
              </p>
              <Button className="md:hidden" asChild>
                <Link href="#rates">
                  Check Rates <ChevronDoubleDownIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <ZesaCalculator />
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full max-w-2xl">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
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
              href="/calculators/currency-converter"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zig.png"
                  alt={`ZiG/ZWL Currency Converter logo`}
                />
              </Avatar>
              Currency Converter
            </Link>
            <Link
              href="/calculators/zimra-duty"
              className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 hover:bg-zinc-100 sm:px-4 sm:py-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-zinc-300">
                <AvatarImage
                  src="/assets/calc-logos/zimra.png"
                  alt={`ZIMRA logo`}
                />
              </Avatar>
              ZIMRA Duty Calculator
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
