import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { env } from '@/env';
import PoliciesHeader from './_components/header';
import PoliciesFooter from './_components/footer';
import PoliciesBanner from './_components/banner';

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
        <PoliciesBanner />
        <PoliciesHeader />
        {children}
        <PoliciesFooter />
        <Analytics />
        <GoogleAnalytics gaId={env.GA_SECRET!} />
      </body>
    </html>
  );
}
