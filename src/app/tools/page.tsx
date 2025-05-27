import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Wrench, DollarSign, Settings, School } from 'lucide-react';
import Container from '@/components/container';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { siteConfig } from '@/lib/config';

const tools = [
  {
    name: 'EcoCash Calculator (USD)',
    slug: 'ecocash-calculator',
    description: 'Calculate EcoCash USD transaction fees and charges for various amounts',
    icon: Calculator,
    category: 'Financial'
  },
  {
    name: 'USD to ZiG Converter',
    slug: 'usd-zwl-converter',
    description: 'Real-time currency conversion tool for pricing goods/services (USD to ZiG).',
    icon: Calculator,
    category: 'Financial'
  },
  {
    name: 'School Picker',
    slug: 'school-picker',
    description: 'Find schools based on location, type, and other criteria.',
    icon: School,
    category: 'Utility'
  }
];

const categories = [...new Set(tools.map(tool => tool.category))];

export default async function ToolsPage() {
  
  const articles: any[] = []; 
  const popularArticles: any[] = []; 

  return (
    <>
      <Header articles={articles} popularArticles={popularArticles} />
      <Container className="py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Tools & Calculators</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover our collection of useful tools and calculators designed to make your life easier.
          </p>
        </section>

        {categories.map(category => (
          <section key={category} className="mb-16">
            <h2 className="mb-6 text-2xl font-bold flex items-center gap-2 tracking-tight" style={{ color: '#eab308' }}>
              <Settings className="h-6 w-6" />
              {category} Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tools
                .filter(tool => tool.category === category)
                .map(tool => {
                  const IconComponent = tool.icon;
                  return (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" style={{ color: '#eab308' }} />
                            </div>
                            <CardTitle className="text-xl group-hover:underline">{tool.name}</CardTitle>
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

        <section className="mt-20 bg-muted/50 rounded-xl p-8 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-2">Need a specific tool?</h3>
          <p className="text-muted-foreground mb-4 max-w-xl">
            Can\'t find what you\'re looking for? Use our Tool Picker to get personalized recommendations.
          </p>
          <Link 
            href="/tools/tool-picker" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
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
  description: 'Discover useful tools and calculators including EcoCash calculator, tool picker, and more to simplify your daily tasks.',
  keywords: 'tools, calculators, EcoCash, Zimbabwe, utility tools'
};