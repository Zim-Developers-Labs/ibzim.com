import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calculator, Wrench, Settings, School } from 'lucide-react';
import Container from '@/components/container';
import Footer from '@/components/footer';
import Header from '@/components/header';
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
    name: 'USD to ZiG Converter',
    slug: 'usd-zwl-converter',
    description:
      'Real-time currency conversion tool for pricing goods/services (USD to ZiG).',
    icon: Calculator,
    category: 'Financial',
  },
  {
    name: 'School Picker',
    slug: 'school-picker',
    description: 'Find schools based on location, type, and other criteria.',
    icon: School,
    category: 'Utility',
  },
];

const categories = [...new Set(tools.map((tool) => tool.category))];

export default async function ToolsPage() {
  const articles: any[] = [];
  const popularArticles: any[] = [];

  return (
    <>
      <Header articles={articles} popularArticles={popularArticles} />
      <Container className="py-12">
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
          <section key={category} className="mb-16">
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
                  return (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group"
                    >
                      <Card className="group h-full cursor-pointer transition-shadow hover:shadow-lg">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 rounded-lg p-2">
                              <IconComponent
                                className="text-primary h-6 w-6"
                                style={{ color: '#eab308' }}
                              />
                            </div>
                            <CardTitle className="text-xl group-hover:underline">
                              {tool.name}
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

        <section className="bg-muted/50 mt-20 flex flex-col items-center rounded-xl p-8 text-center">
          <h3 className="mb-2 text-2xl font-bold">Need a specific tool?</h3>
          <p className="text-muted-foreground mb-4 max-w-xl">
            Can&#29;t find what you&#39;'re looking for? Use our Tool Picker to
            get personalized recommendations.
          </p>
          <Link
            href="/tools/tool-picker"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-6 py-3 font-semibold transition-colors"
          >
            <Wrench className="h-5 w-5" />
            Find My Tool
          </Link>
        </section>
      </Container>
      <Footer siteShortName={siteConfig.shortName} />
    </>
  );
}

export const metadata = {
  title: 'Tools & Calculators | IBZim',
  description:
    'Discover useful tools and calculators including EcoCash calculator, tool picker, and more to simplify your daily tasks.',
  keywords: 'tools, calculators, EcoCash, Zimbabwe, utility tools',
};
