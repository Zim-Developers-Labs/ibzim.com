import '../globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { env } from '@/env';
import CalculatorFooter from './calculators/footer';
import CalculatorHeader from './calculators/header';
import GoogleAdsense from '@/components/google-adsense';
import Banner from '@/components/banner';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <Toaster position="top-center" />
        <Banner />
        <CalculatorHeader />
        {children}
        <CalculatorFooter />
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={env.GA_SECRET!} />
        {/* <GoogleAdsense /> // TODO add back adsense */}
      </body>
    </html>
  );
}
