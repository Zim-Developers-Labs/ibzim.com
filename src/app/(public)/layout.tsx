import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { getSearchData } from '@/sanity/lib/actions';
import { siteConfig } from '@/lib/config';
import { Toaster } from '@/components/ui/sonner';
import Banner from '@/components/banner';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Suspense } from 'react';
import GoogleAdsense from '@/components/google-adsense';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { validateRequest } from '@/lib/auth/validate-request';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IBZim Blog',
  description:
    'All about Zimbabwe. Read articles, vote for awards, use tools and enjoy the IBZim events calendar all year round.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { allArticles, popularArticles } = await getSearchData(
    siteConfig.popularArticleIds,
    siteConfig.documentPrefix,
  );

  const { user } = await validateRequest();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <Toaster />
        <Banner />
        <Header
          articles={allArticles}
          popularArticles={popularArticles}
          user={user}
        />
        {children}
        <Footer siteShortName={siteConfig.shortName} />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={process.env.GA_SECRET!} />
      </body>
    </html>
  );
}
