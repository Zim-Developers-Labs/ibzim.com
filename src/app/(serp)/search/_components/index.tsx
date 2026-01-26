'use client';

import Container from '@/components/container';
import SERPHeader from './header';
import { useUser } from '@/hooks/user-context';

export default function SERPageComponents({ q }: { q: string }) {
  const { user } = useUser();
  return (
    <>
      <SERPHeader user={user} q={q} />
      <div className="relative w-full bg-zinc-100">
        <div className="from-primaryColor/25 via-secondaryColor/5 flex h-screen w-full flex-col justify-start bg-gradient-to-b to-transparent pt-44 sm:pt-28">
          <Container>
            <div>query = {q}</div>
          </Container>
        </div>
      </div>
    </>
  );
}
