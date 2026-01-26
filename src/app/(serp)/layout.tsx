import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getCurrentSession } from '@/lib/server/session';
import { UserProvider } from '@/hooks/user-context';
import { env } from '@/env';
import HomeHeader from '../(home)/home-header';
import HomeFooter from '../(home)/home-footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IBZim Search Engine Results Page',
  description:
    'Results for your search query on IBZim, the Zimbabwean Information Hub.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentSession();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <UserProvider dbUser={user}>
          <Toaster position="top-center" />
          <HomeHeader user={user} />
          {children}
          <HomeFooter />
        </UserProvider>
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={env.GA_SECRET!} />
      </body>
    </html>
  );
}
