import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { Toaster } from '@/components/ui/sonner';
import Banner from '@/components/banner';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { validateRequest } from '@/lib/auth/validate-request';
import { getSearchData } from '@/sanity/lib/actions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IBZim: Zimbabwean Information Hub',
  description:
    'An information hub empowering Zimbabweans with raw and authentic knowledge. Signup and complete your profile to join the community.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  const { allArticles, popularArticles } = await getSearchData(
    siteConfig.popularArticleIds,
    siteConfig.documentPrefix,
  );

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
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={process.env.GA_SECRET!} />
      </body>
    </html>
  );
}
