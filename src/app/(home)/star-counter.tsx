import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import stats from '../../../public/stats.json';

export default function StarCounter() {
  return (
    <Link
      href="https://github.com/Zim-Developers-Labs/ibzim.com"
      className="border-border bg-foreground hover:bg-foreground/80 mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5"
    >
      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
      <span className="text-background text-xs font-medium">
        {stats.stars} stars on Github
      </span>
      <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
    </Link>
  );
}
