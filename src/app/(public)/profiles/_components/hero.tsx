import { logoFont } from '@/lib/fonts';

export default function WikiHero() {
  return (
    <section className="bg-zinc-50 py-16 md:py-20">
      <h1
        className={`${logoFont.className} text-primaryColor mx-auto mb-6 text-center text-5xl tracking-wide lg:text-7xl`}
      >
        IB<span className="text-zinc-900">ZIM</span> Profiles
      </h1>
      <p className="mx-auto max-w-xl px-4 text-center tracking-widest md:px-0 md:text-lg">
        Everyday we write profile articles on prominent people in Zimbabwe whom
        you might like to know and learn from.
      </p>
    </section>
  );
}
