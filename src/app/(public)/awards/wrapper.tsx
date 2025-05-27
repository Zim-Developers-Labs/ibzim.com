import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function AwardsPageWrapper() {
  return (
    <>
      <section className="relative overflow-hidden bg-zinc-900 px-4 pt-28 pb-48 text-white sm:px-6">
        <svg
          viewBox="0 0 1208 1024"
          aria-hidden="true"
          className="absolute -bottom-48 left-1/2 z-0 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-20 lg:-top-0 lg:bottom-auto lg:translate-y-0"
        >
          <ellipse
            cx={604}
            cy={512}
            rx={604}
            ry={512}
            fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)"
          />
          <defs>
            <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
              <stop stopColor="#EAB308" />
              <stop offset={1} stopColor="#FF5A5A" />
            </radialGradient>
          </defs>
        </svg>
        <span className="from-secondaryColor via-primaryColor to-secondaryColor block bg-gradient-to-t bg-clip-text text-center tracking-widest text-transparent">
          SEASON 4 2025
        </span>
        <h1 className="my-4">
          <span className="block text-center text-4xl tracking-wide">
            People&#39;s Choice <span className="font-light">Awards</span>
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-center font-light">
          Celebrating excellence across industries, cities, entertainment,
          education, and music throughout the year
        </p>
        <Button className="mx-auto mt-6 flex items-center rounded-full bg-zinc-800 px-8 py-4">
          <Lock />
          <span className="ml-1">Coming Soon</span>
        </Button>
      </section>
    </>
  );
}
