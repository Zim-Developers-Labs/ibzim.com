import { Metadata } from 'next';
import CurrencyConverterPageWrapper from './wrapper';
import { siteConfig } from '@/lib/config';
import { prepareArticleMetadata } from '@/lib/article-metadata';

type Props = {
  params: Promise<{ pair: string }>;
};

// Function to convert currency codes to readable format
function formatCurrencyPair(pair: string): {
  from: string;
  to: string;
  readable: string;
} {
  const currencyNames: Record<string, string> = {
    zig: 'ZiG',
    usd: 'USD',
    eur: 'Euro',
    zar: 'Rand',
  };

  const [fromCode, toCode] = pair.toLowerCase().split('-');
  const fromName = currencyNames[fromCode] || fromCode.toUpperCase();
  const toName = currencyNames[toCode] || toCode.toUpperCase();

  return {
    from: fromName,
    to: toName,
    readable: `${fromName} to ${toName}`,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const { from, to, readable } = formatCurrencyPair(pair);

  return prepareArticleMetadata({
    title: `${readable} Converter | IBZim`,
    description: `Convert ${from} amounts to ${to} with the latest exchange rates using our Currency Converter. Get real-time conversion rates and accurate calculations.`,
    pageUrl: `/currency-converter/${pair}`,
    ogImage: {
      url: '/banner.webp',
      height: 675,
      width: 1200,
    },
    siteConfig,
  });
}

export default function CurrencyConverterPage() {
  return <CurrencyConverterPageWrapper />;
}
