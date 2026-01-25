import '../globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { globalGETRateLimit } from '@/lib/server/request';
import { getCurrentSession } from '@/lib/server/session';
import { redirect } from 'next/navigation';
import { DOMAIN_URLS } from '@/lib/constants';
import { UserProvider } from '@/hooks/user-context';
import { Toaster } from '@/components/ui/sonner';
import AccountLayout from './_components';

export const metadata: Metadata = {
  title: 'IBZim Account Centre',
  description:
    'Manage your IBZim account settings and preferences in one place.',
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await globalGETRateLimit())) {
    return 'Too many requests';
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect(`/sign-in`);
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} h-full antialiased`}
    >
      <body>
        <UserProvider dbUser={user}>
          <AccountLayout>{children}</AccountLayout>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
