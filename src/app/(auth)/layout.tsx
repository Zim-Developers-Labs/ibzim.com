import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'IBZim Auth',
  description:
    'Login or sign up to access your IBZim account and start earning rewards today!',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
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
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
