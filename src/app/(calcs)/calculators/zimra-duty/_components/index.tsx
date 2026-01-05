import Container from '@/components/container';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  InfoIcon,
  Car,
  Package,
  DollarSign,
  Calculator,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import DutyCalculator from './calculator';

export default function ZimraDutyCalculatorComponents() {
  return (
    <main className="bg-zinc-50">
      <Container className="py-12">
        <div className="mb-6">
          <div className="mb-4 flex items-start gap-3">
            <Avatar className="h-16 w-16 rounded-md border border-zinc-300">
              <AvatarImage
                src="/assets/calc-logos/zimra.png"
                alt={`Zimra Duty Calculator`}
              />
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">ZIMRA Duty Calculator</h1>
              <p className="text-muted-foreground">
                Calculate import duty and taxes for goods imported into
                Zimbabwe.
              </p>
            </div>
          </div>
        </div>
        <DutyCalculator />
        <div className="mb-4 inline-block rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-zinc-200">
          Contact Us +263717238876 if the calculator is not working as expected.
        </div>
        {/* How It Works Section */}
        <section className="mt-12 rounded-md border border-zinc-200 bg-white p-4 sm:p-6">
          <h2 className="mb-2 text-3xl font-semibold">
            How This Calculator Works
          </h2>
          <p className="mb-10 text-zinc-600">
            Simple steps you can follow to use the IBZIM ZIMRA Duty Calculator.
          </p>

          <div className="space-y-8">
            {/* Vehicles */}
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              <div className="flex items-start gap-2">
                <Car className="mt-0.5 size-5 text-zinc-700" />
                <div>
                  <h3 className="font-semibold">Vehicles</h3>
                  <p className="text-xs text-zinc-500">
                    Cars, trucks, motorcycles
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="border-l-2 border-zinc-200 pl-4">
                  <p className="mb-1 text-xs font-medium text-zinc-400">
                    Step 1
                  </p>
                  <p className="text-sm text-zinc-700">
                    Choose import type (Standard or Returning Resident)
                  </p>
                </div>
                <div className="border-l-2 border-zinc-200 pl-4">
                  <p className="mb-1 text-xs font-medium text-zinc-400">
                    Step 2
                  </p>
                  <p className="text-sm text-zinc-700">
                    Select vehicle details & year (10+ years may be banned)
                  </p>
                </div>
                <div className="border-l-2 border-zinc-200 pl-4">
                  <p className="mb-1 text-xs font-medium text-zinc-400">
                    Step 3
                  </p>
                  <p className="text-sm text-zinc-700">
                    Enter values to calculate VDP, duty, and VAT
                  </p>
                </div>
              </div>
            </div>

            {/* Goods */}
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              <div className="flex items-start gap-2">
                <Package className="mt-0.5 size-5 text-zinc-700" />
                <div>
                  <h3 className="font-semibold">Goods</h3>
                  <p className="text-xs text-zinc-500">
                    Electronics, clothing, etc
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="border-l-2 border-zinc-200 pl-4">
                  <p className="mb-1 text-xs font-medium text-zinc-400">
                    Step 1
                  </p>
                  <p className="text-sm text-zinc-700">Choose import type</p>
                </div>
                <div className="border-l-2 border-zinc-200 pl-4">
                  <p className="mb-1 text-xs font-medium text-zinc-400">
                    Step 2
                  </p>
                  <p className="text-sm text-zinc-700">
                    Select category & item
                  </p>
                </div>
                <div className="border-l-2 border-zinc-200 pl-4">
                  <p className="mb-1 text-xs font-medium text-zinc-400">
                    Step 3
                  </p>
                  <p className="text-sm text-zinc-700">Choose import method</p>
                </div>
                <div className="border-l-2 border-zinc-200 pl-4">
                  <p className="mb-1 text-xs font-medium text-zinc-400">
                    Step 4
                  </p>
                  <p className="text-sm text-zinc-700">
                    Enter quantity if needed
                  </p>
                </div>
              </div>
            </div>

            {/* Formula Row */}
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              <div className="flex items-start gap-2">
                <Calculator className="mt-0.5 size-5 text-zinc-700" />
                <div>
                  <h3 className="font-semibold">Formulas</h3>
                  <p className="text-xs text-zinc-500">How we calculate</p>
                </div>
              </div>
              <div className="grid gap-4 rounded bg-zinc-100 p-4 text-xs text-zinc-600 sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-medium">Vehicles</p>
                  <p>VDP = Invoice + Ocean Freight + Road Freight</p>
                  <p>Duty = VDP × Rate + Surtax (35% if 5+ years)</p>
                </div>
                <div>
                  <p className="mb-1 font-medium">Goods</p>
                  <p>VDP = FOB + Freight</p>
                  <p>Duty = VDP × Rate + Per-Unit Charges</p>
                </div>
              </div>
            </div>

            {/* Features Row */}
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-5 text-zinc-700" />
                <div>
                  <h3 className="font-semibold">Features</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
                  Multi-Currency
                </span>
                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
                  Returning Resident Benefits
                </span>
                <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
                  Official ZIMRA Rates
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              <h2>Frequently Asked Questions</h2>
            </CardTitle>
            <CardDescription>
              <p>
                Common questions about ZIMRA import duties and this calculator
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left" asChild>
                  <h3>What is Value for Duty Purpose (VDP)?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    VDP is the total taxable value used to calculate customs
                    duty. For vehicles, it includes the invoice value, ocean
                    freight, and road freight (usually 6% if not specified). For
                    goods, it includes FOB (Freight on Board) value plus freight
                    costs. All applicable duties and taxes are calculated based
                    on this VDP.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left" asChild>
                  <h3>Who qualifies for Returning Resident duty suspension?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    Zimbabwean citizens or permanent residents who have been
                    outside Zimbabwe for at least 2 years continuously may
                    qualify. The duty suspension benefit (up to $40,000) applies
                    to personal effects, household goods, and one vehicle. Use
                    the eligibility checker in the calculator to determine your
                    qualification based on your time abroad.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left" asChild>
                  <h3>What is the 35% surtax on vehicles?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    The surtax is an additional tax applied to passenger
                    vehicles that are 5 years or older (calculated from year of
                    manufacture). It's 35% of the VDP and is charged on top of
                    the standard customs duty. Vehicles less than 5 years old
                    and commercial vehicles (trucks, buses) are generally exempt
                    from this surtax.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left" asChild>
                  <h3>Can I import a vehicle older than 10 years?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    No. Zimbabwe has banned the importation of passenger
                    vehicles (sedans, hatchbacks, SUVs, double cabs) that are 10
                    years or older from their year of manufacture. However,
                    commercial vehicles like trucks, buses, tractors, and
                    specialized equipment are exempt from this age restriction.
                    The calculator will alert you if your vehicle falls under
                    the ban.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left" asChild>
                  <h3>
                    What's the difference between the four importation methods
                    for goods?
                  </h3>
                  What's the difference between the four importation methods for
                  goods?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700">
                  <ul className="list-inside list-disc space-y-2">
                    <li>
                      <strong>By Air:</strong> Fastest method, requires air
                      freight and insurance costs
                    </li>
                    <li>
                      <strong>By Post:</strong> For postal shipments, requires
                      postage value
                    </li>
                    <li>
                      <strong>By Road:</strong> Land transport, can include
                      ocean freight for overseas goods. Road freight defaults to
                      5% of FOB if not specified
                    </li>
                    <li>
                      <strong>By Rail:</strong> Similar to road, can include
                      ocean freight. Rail freight defaults to 5% of FOB if not
                      specified
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left" asChild>
                  <h3>What are per-unit duties on goods?</h3>
                  What are per-unit duties on goods?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    Some goods have additional duties charged per unit (kg,
                    pair, litre, etc.) on top of the percentage-based duty. For
                    example, clothing has 40% duty plus $3 per kilogram, and
                    footwear has 40% duty plus $1 per pair. The calculator
                    automatically adds these per-unit charges when you enter the
                    quantity.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left" asChild>
                  <h3>How is VAT calculated?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    VAT (Value Added Tax) is 15% in Zimbabwe and is calculated
                    on the VDP plus customs duty. The formula is: VAT = (VDP +
                    Customs Duty) × 15%. This means VAT is charged on the total
                    value including the duty already added, not just on the
                    original purchase price.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left" asChild>
                  <h3>What currencies can I use for payment?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    The calculator supports multiple invoice currencies (USD,
                    ZAR/NAD, EUR, GBP, CNY, AED) with automatic conversion. All
                    calculations are displayed in USD for consistency. ZIMRA
                    typically accepts payment in USD or ZAR, but check with
                    ZIMRA for current payment options and exchange rates at the
                    time of clearance.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left" asChild>
                  <h3>What documents do I need to clear goods at ZIMRA?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>Typical documents required include:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Commercial invoice or purchase receipt</li>
                    <li>Bill of lading or airway bill</li>
                    <li>ZIMRA import declaration form</li>
                    <li>Proof of payment for duties calculated</li>
                    <li>
                      For vehicles: Certificate of registration, roadworthy
                      certificate
                    </li>
                    <li>
                      For returning residents: Proof of residence abroad,
                      passport stamps
                    </li>
                  </ul>
                  <p className="mt-2">
                    Contact ZIMRA or a clearing agent for a complete list
                    specific to your situation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left" asChild>
                  <h3>Are there any goods with 0% duty rate?</h3>
                </AccordionTrigger>
                <AccordionContent className="text-slate-700" asChild>
                  <p>
                    Yes! Several essential items have 0% duty rates, including:
                    computers and tablets, printers, chargers, agricultural
                    machinery, textbooks, diapers, sanitary pads, solar modules,
                    generators, and many others. However, you may still need to
                    pay VAT (15%) on these items. Check the goods category in
                    the calculator to see specific duty rates for each item.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

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
    </main>
  );
}
