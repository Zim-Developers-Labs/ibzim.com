import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getCurrentSession } from '@/lib/server/session';
import { UserProvider } from '@/hooks/user-context';
import { env } from '@/env';
import HomeHeader from './home-header';
import HomeFooter from './home-footer';
import { ThemeProvider } from '@/components/theme-provider';

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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider dbUser={user}>
            <Toaster position="top-center" />
            <HomeHeader user={user} />
            {children}
            <HomeFooter />
          </UserProvider>
        </ThemeProvider>
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={env.GA_SECRET!} />
      </body>
    </html>
  );
}
