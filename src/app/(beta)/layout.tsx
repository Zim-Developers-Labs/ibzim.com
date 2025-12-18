import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { env } from '@/env';
import BetaHeader from './header';
import BetaBanner from './banner';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IBZIM Beta Program',
  description:
    'We’re opening ibzim to early testers before the official launch. Your feedback helps us fix bugs and improve features.',
};

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
        <BetaBanner />
        <BetaHeader />
        {children}
        <Footer siteShortName="IBZIM" />
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={env.GA_SECRET!} />
      </body>
    </html>
  );
}
