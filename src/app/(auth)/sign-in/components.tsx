import { TempErrForm } from '@/components/temp';
import { LoginForm } from './login-form';
import { logoFont } from '@/lib/fonts';
import Image from 'next/image';
import Link from 'next/link';

export function SignInComponents({
  callbackUrl,
  error,
}: {
  callbackUrl?: string;
  error?: string;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/">
            <span className={`${logoFont.className} block text-3xl`}>
              <span className="text-black">IB</span>
              <span className="text-primaryColor">ZIM</span>
            </span>
            <span className="block text-xs font-light tracking-[24px] text-zinc-800">
              AUTH
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* <LoginForm callbackUrl={callbackUrl} error={error} /> */}
            <TempErrForm callbackUrl={callbackUrl} error={error} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/cyber-city.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height={1439}
          width={960}
        />
      </div>
    </div>
  );
}
