import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import Banner from '@/components/banner';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import HomeHeader from './home-header';
import Footer from '@/components/footer';
import { getCurrentSession } from '@/lib/server/session';
import { UserProvider } from '@/hooks/user-context';
import { env } from '@/env';
import { getAllNotifications } from '@/lib/sanity/client';
import { getUserNotifications } from '@/components/header/notifications/actions';

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
  const { user } = await getCurrentSession();
  const notifications = await getAllNotifications();
  const neonUserNotifications = user ? await getUserNotifications(user.id) : [];

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <UserProvider dbUser={user}>
          <Toaster position="top-center" />
          <Banner />
          <HomeHeader
            user={user}
            notifications={notifications}
            neonUserNotifications={neonUserNotifications}
          />
          {children}
          <Footer siteShortName="IBZIM" />
        </UserProvider>
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={env.GA_SECRET!} />
      </body>
    </html>
  );
}
