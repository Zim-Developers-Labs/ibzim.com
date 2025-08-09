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
import UserNav from './user-nav';
import { redirect } from 'next/navigation';
import { Paths } from '@/lib/constants';
import { CompleteProfileBanner, VerifyEmailBanner } from './banners';
import { getSearchData } from '@/sanity/lib/actions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IBZim Settings',
  description:
    'Manage your IBZim account settings, preferences, and personal information.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect(Paths.Login);
  }

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
        {!user.emailVerified && (
          <VerifyEmailBanner email={user.email} userId={user.id} />
        )}
        {!user.profileCompleted && <CompleteProfileBanner />}
        <UserNav />
        {children}
        <Footer siteShortName={siteConfig.shortName} />
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={process.env.GA_SECRET!} />
      </body>
    </html>
  );
}
