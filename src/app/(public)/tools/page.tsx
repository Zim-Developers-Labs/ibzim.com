import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calculator,
  Settings,
  School,
  MapPin,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { Metadata } from 'next';
import { preparePageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/config';

const tools = [
  {
    name: 'EcoCash Calculator (USD)',
    slug: 'ecocash-calculator',
    description:
      'Calculate EcoCash USD transaction fees and charges for various amounts',
    icon: Calculator,
    category: 'Financial',
  },
  {
    name: 'Currency Converter',
    slug: 'currency-converter/usd-zig',
    description:
      'Real-time currency conversion tool for pricing goods/services (USD to ZiG).',
    icon: Calculator,
    category: 'Financial',
  },
  {
    name: 'School Picker',
    slug: 'school-picker/a-level-education',
    description: 'Find schools based on location, type, and other criteria.',
    icon: School,
    category: 'Utility',
  },
  {
    name: 'Distance Calculator',
    slug: 'distance-calculator',
    description:
      'Calculate distances, fuel costs, and travel times between locations in Zimbabwe.',
    icon: MapPin,
    category: 'Utility',
  },
  {
    name: 'ZESA Electricity Calculator',
    slug: 'zesa-electricity-calculator',
    description:
      'Calculate ZESA electricity costs based on units consumed and tariffs.',
    icon: Zap,
    category: 'Utility',
  },
];

const categories = [...new Set(tools.map((tool) => tool.category))];

export default async function ToolsPage() {
  return (
    <>
      <section className="mb-12">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight">
          Tools & Calculators
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Discover our collection of useful tools and calculators designed to
          make your life easier.
        </p>
      </section>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2
            className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight"
            style={{ color: '#eab308' }}
          >
            <Settings className="h-6 w-6" />
            {category} Tools
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => {
                const IconComponent = tool.icon;
                if (tool.name === 'School Picker') {
                  return (
                    <div key={tool.slug} className="group">
                      <Card className="group h-full cursor-pointer shadow-none hover:bg-zinc-100">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-zinc-100 p-2">
                              <IconComponent
                                className="text-primaryColor h-6 w-6"
                                strokeWidth={1}
                              />
                            </div>
                            <CardTitle>
                              <h3 className="text-xl group-hover:underline">
                                {tool.name}
                              </h3>
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {tool.description}
                          </CardDescription>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <Link
                              href="/tools/school-picker/primary-education"
                              className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                            >
                              Primary
                              <ChevronRight className="ml-1 inline-block h-4 w-4" />
                            </Link>
                            <Link
                              href="/tools/school-picker/o-level-education"
                              className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                            >
                              O&nbsp;Level
                              <ChevronRight className="ml-1 inline-block h-4 w-4" />
                            </Link>
                            <Link
                              href="/tools/school-picker/a-level-education"
                              className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                            >
                              A&nbsp;Level
                              <ChevronRight className="ml-1 inline-block h-4 w-4" />
                            </Link>

                            <Link
                              href="/tools/school-picker/tetiary-education"
                              className="w-full rounded-md bg-teal-200 py-2 text-center text-sm hover:bg-teal-300"
                            >
                              Tetiary
                              <ChevronRight className="ml-1 inline-block h-4 w-4" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                }
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group"
                  >
                    <Card className="group h-full cursor-pointer shadow-none hover:bg-zinc-100">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-zinc-100 p-2">
                            <IconComponent
                              className="text-primaryColor h-6 w-6"
                              strokeWidth={1}
                            />
                          </div>
                          <CardTitle>
                            <h3 className="text-xl group-hover:underline">
                              {tool.name}
                            </h3>
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {tool.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `Tools & Calculators | IBZim`,
    description: `Discover useful tools and calculators including distance, ecocash calculator, school picker, government structure and more.`,
    pageUrl: '/tools',
    imageUrl: '/banner.webp',
    siteConfig: siteConfig,
  });
