import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import Banner from '@/components/banner';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import HomeHeader from './home-header';
import { validateRequest } from '@/lib/auth/validate-request';
import Footer from '@/components/footer';

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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <Toaster />
        <Banner />
        <HomeHeader user={user} />
        {children}
        <Footer siteShortName="IBZIM" />
        <Analytics />
        {/* <SpeedInsights /> */}
        <GoogleAnalytics gaId={process.env.GA_SECRET!} />
      </body>
    </html>
  );
}
