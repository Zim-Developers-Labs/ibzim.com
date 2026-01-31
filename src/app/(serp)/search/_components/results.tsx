import { SearchIndexEntry } from '@/types';
import { FetchAllEntriesResult } from './actions';
import { Icons } from '@/components/icons';
import { Check, DollarSign, Flag } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { logLinkClick } from '@/tinybird/analytics';

function ExternalSearch({ q }: { q: string }) {
  return (
    <div className="my-12 max-w-xl">
      {/* Alert - left border accent */}
      <div className="mb-6 border-l-2 border-amber-400 bg-amber-50/50 py-3 pr-4 pl-4 dark:bg-amber-900/50">
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          🙋‍♂️ We are still indexing the Zimbabwean Web
        </p>
      </div>

      {/* Card - left-aligned with divider */}
      <div className="border-t border-zinc-200 pt-6">
        <p className="mb-4 text-sm">{"Didn't Find What you need? 🥲"}</p>
        <p className="mb-3 text-xs font-medium tracking-wide text-zinc-600 uppercase dark:text-zinc-300">
          Continue on:
        </p>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(q)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-white px-2 py-2 text-sm text-zinc-600 shadow-sm transition hover:shadow sm:px-4 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Icons.googleGLogo className="h-4 w-4" />
            <span>Google</span>
          </a>
          <a
            href={`https://www.youtube.com/search?q=${encodeURIComponent(q)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-white px-2 py-2 text-sm text-zinc-600 shadow-sm transition hover:shadow sm:px-4 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Icons.youtubeLogo className="h-4 w-4" />
            <span>YouTube</span>
          </a>
          <a
            href={`https://www.amazon.com/s?k=${encodeURIComponent(q)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-white px-2 py-2 text-sm text-zinc-600 shadow-sm transition hover:shadow sm:px-4 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Icons.amazonLogo className="h-4 w-4" />
            <span>Amazon</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResultsComponent({
  searchId,
  results,
  q,
}: {
  searchId: string;
  results: FetchAllEntriesResult | null;
  q: string;
}) {
  if (!results || results.entries.length === 0) {
    return (
      <div className="relative mx-auto mb-4 w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="my-8 flex max-w-xl flex-col items-center justify-between sm:flex-row">
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            No results found...our CEO owes you a dollar😊
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-green-600 sm:mt-0 dark:text-green-400">
            <DollarSign className="size-3" />
            <Dialog>
              <DialogTrigger asChild>
                <span className="cursor-pointer">
                  Claim Dollar
                  {/* Will give dollar if user is signed up, search term is Zimbabwe based and if i have the dollar xd*/}
                </span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <DollarSign className="size-5 text-green-600" />
                    Claim Your Dollar
                  </DialogTitle>
                  <DialogDescription>
                    Terms & Conditions for the dollar bet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="size-3 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-foreground text-sm">
                      You have been signed up for at least 3 days
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="size-3 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-foreground text-sm">
                      Your search query is Zimbabwe related
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="size-3 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-foreground text-sm">
                      {"You haven't claimed a dollar before (we track IP)"}
                    </p>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      window.open(
                        `https://wa.me/+263780105064?text=Hi Tino, Can I have my dollar 😂. My search was ${q}.`,
                        '_blank',
                      );
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    I Qualify - Claim Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ExternalSearch q={q} />
      </div>
    );
  }

  const linkClick = async ({
    result,
    searchId,
    position,
  }: {
    result: SearchIndexEntry;
    searchId: string;
    position: number;
  }) => {
    await logLinkClick(searchId, result.url, position);
    window.open(result.url, '_blank');
  };

  return (
    <div className="relative mx-auto mb-4 w-full max-w-7xl px-4 sm:px-8 lg:px-10">
      <div>
        <div className="mb-8 flex max-w-xl items-center justify-between text-sm">
          <div className="text-zinc-700 dark:text-zinc-300">
            Found {results.entries.length} results in {results.timeTaken}ms
          </div>
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <Flag className="size-3" />
            <span
              className="cursor-pointer"
              onClick={() => {
                window.open(
                  `https://wa.me/+263717238876?text=Hi IBZIM Team, I found an inaccuracy in the search results for query: ${q}`,
                  '_blank',
                );
              }}
            >
              Report Inaccuracy
            </span>
          </div>
        </div>
        <aside
          className="mb-8 max-w-xl overflow-hidden rounded-md bg-white dark:bg-zinc-900"
          role="banner"
        >
          <div className="relative isolate flex items-center justify-center gap-x-2 overflow-hidden bg-yellow-500/50 px-6 py-2.5 sm:px-3.5 md:gap-x-6 dark:bg-yellow-500/20">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                }}
                className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-50"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                }}
                className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              />
            </div>
            <div className="flex items-center gap-x-4 gap-y-2">
              <p className="text-xs text-gray-800 dark:text-zinc-100">
                We are actively working to make it better😊
              </p>
            </div>
          </div>
        </aside>
        {/* Results */}
        <ul className="flex max-w-xl flex-col space-y-10">
          {results.entries.map((entry: SearchIndexEntry, i) => (
            <li key={entry.url}>
              <div className="flex items-start gap-2 sm:gap-4">
                <div className="grid h-8 w-8 place-content-center rounded-sm bg-white">
                  <Icons.ibLogoSM className="h-3 w-fit text-zinc-900" />
                </div>
                <div className="-mt-1">
                  <div className="">IBZIM</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    www.ibzim.com
                  </div>
                </div>
              </div>
              <a
                href={entry.url}
                onClick={(e) => {
                  e.preventDefault();

                  linkClick({ result: entry, searchId, position: i + 1 });
                }}
                className="mb-2 block text-lg text-[#434fcf] hover:underline dark:text-[#b2c3ff]"
              >
                {entry.name}
              </a>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {entry.description}
              </p>
            </li>
          ))}
        </ul>
        <ExternalSearch q={q} />
      </div>
    </div>
  );
}
