import { logoFont } from '@/lib/fonts';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { RegisterForm } from './register-form';

export default function SignUpComponents({
  callbackUrl,
  error,
}: {
  callbackUrl?: string;
  error?: string;
}) {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <Link
        href={`/sign-in${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 md:top-8 md:right-8',
        )}
      >
        Login Instead
        <LogIn />
      </Link>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/cyber-city.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height={1439}
          width={960}
        />
      </div>
      <div className="mt-8 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-6 block">
              <span className={`${logoFont.className} block text-4xl`}>
                <span className="text-black">IB</span>
                <span className="text-primaryColor">ZIM</span>
              </span>
            </Link>
            <RegisterForm callbackUrl={callbackUrl} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}
