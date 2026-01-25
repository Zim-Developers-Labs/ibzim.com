import { InfoIcon } from 'lucide-react';

export default function FooterBanner() {
  return (
    <aside role="banner">
      <div
        className="flex items-center justify-center gap-2 border-t border-zinc-700 bg-zinc-900 px-4 py-3 text-center text-white"
        role="alert"
      >
        <InfoIcon className="h-4 w-4" />
        <div className="text-xs">
          IBZIM Public Beta • Data may reset • Features may change
        </div>
      </div>
    </aside>
  );
}
