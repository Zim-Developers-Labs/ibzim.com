import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IBZim Account Centre',
  description:
    'Manage your IBZim account settings and preferences in one place.',
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
      <body>{children}</body>
    </html>
  );
}
