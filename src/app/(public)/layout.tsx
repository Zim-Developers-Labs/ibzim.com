import { Inter } from 'next/font/google';
import '../globals.css';
import { getCurrentSession } from '@/lib/server/session';
import { getAllNotifications } from '@/lib/sanity/client';
import { getUserNotifications } from '@/components/header/notifications/actions';
import { UserProvider } from '@/hooks/user-context';
import { Toaster } from '@/components/ui/sonner';
import Banner from '@/components/banner';
import Footer from '@/components/footer';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { env } from '@/env';
import Header from '@/components/header';
import { getSearchData } from '@/lib/sanity/actions';
import { siteConfig } from '@/lib/config';
import GoogleAdsense from '@/components/google-adsense';
import { getStarsCount } from '../(home)/actions';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentSession();

  const { allDocuments } = await getSearchData();
  const starsCount = await getStarsCount();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <UserProvider dbUser={user}>
          <Toaster
            position="bottom-right"
            theme="light"
            expand={true}
            richColors
            duration={20000}
            closeButton
          />
          <Banner />
          <Header starsCount={starsCount} user={user} articles={allDocuments} />
          {children}
          <Footer siteShortName="IBZIM" />
        </UserProvider>
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={env.GA_SECRET!} />
        <GoogleAdsense />
      </body>
    </html>
  );
}
