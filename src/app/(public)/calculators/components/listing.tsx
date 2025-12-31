import Container from '@/components/container';
import { Avatar } from '@/components/ui/avatar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AvatarImage } from '@radix-ui/react-avatar';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const calculators = [
  {
    id: 'ecocash',
    name: 'EcoCash Calculator',
    description:
      'Calculate EcoCash send money, cash out, and merchant fees with 2% tax included.',
    logoUrl: '/assets/calc-logos/ecocash.png',
    href: '/calculators/ecocash-charges',
  },
  {
    id: 'zimbabwe-distance-table',
    name: 'Distance Table',
    description:
      'View distance between Zimbabwe locations and estimate travel costs including fuel and tolls',
    logoUrl: '/assets/calc-logos/zinara.png',
    href: '/calculators/zimbabwe-distance-table',
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    description:
      'Convert between USD, ZiG, ZAR, and other currencies at current exchange rates.',
    logoUrl: '/assets/calc-logos/zig.png',
    href: '/calculators/currency-converter',
  },
  {
    id: 'zesa',
    name: 'ZESA Calculator',
    description:
      'Calculate ZESA electricity units and costs based on your token purchase amount.',
    logoUrl: '/assets/calc-logos/zesa.png',
    href: '/calculators/zesa-units',
  },
] as const;

export default function CalculatorsListing() {
  return (
    <section id="calculators-listing" className="pb-20">
      <Container>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {calculators.map((calc) => {
            return (
              <Link key={calc.id} href={calc.href} className="group">
                <Card className="h-full shadow-none transition-all group-hover:-translate-y-1">
                  <CardHeader>
                    <Avatar className="mb-4 h-12 w-12 rounded-md border border-zinc-300">
                      <AvatarImage
                        src={calc.logoUrl}
                        alt={`${calc.name} logo`}
                      />
                    </Avatar>
                    <CardTitle className="flex items-center justify-between">
                      {calc.name}
                      <ArrowRight className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-all group-hover:translate-x-1" />
                    </CardTitle>
                    <CardDescription>{calc.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
