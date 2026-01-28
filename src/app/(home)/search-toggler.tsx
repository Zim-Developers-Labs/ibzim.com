'use client';

import { Search, SearchIcon, Loader2 } from 'lucide-react';
import { useState, useEffect, useDeferredValue, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getQueryPredictions, QueryPrediction } from '@/lib/typesense/actions';

export default function SearchToggler() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<QueryPrediction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // useDeferredValue for automatic debouncing (React 19)
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // Navigate to search page with query
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    }
  };

  const popularSearches = ['schools', 'starlink', 'rich'];

  // Fetch suggestions when deferred query changes
  useEffect(() => {
    if (deferredQuery.trim().length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    startTransition(async () => {
      const response = await getQueryPredictions(deferredQuery);
      setSuggestions(response.predictions.map((hit) => hit.document));
      setError(response.error ?? null);
    });
  }, [deferredQuery]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSuggestions([]);
      setError(null);
    }
  }, [open]);

  return (
    <div className="block w-full max-w-2xl">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-fit w-full cursor-pointer rounded-t-3xl rounded-b-none border-zinc-200 bg-white py-5 text-base hover:bg-zinc-50 dark:bg-zinc-700"
          >
            <Search className="size-5 text-zinc-600 dark:text-zinc-100" />
            <div className="pr-2 text-sm text-zinc-600 dark:text-zinc-100">
              Search/Request Information
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="top-32 translate-y-0 sm:top-32 sm:max-w-xl sm:translate-y-0 dark:bg-zinc-900">
          <DialogTitle className="sr-only">Search Documents</DialogTitle>
          <div className="flex items-center border-b">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              type="text"
              placeholder="Search the Zimbabwean Web..."
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div
            className={`scroll-py-2 space-y-4 overflow-y-auto ${query !== '' ? 'max-h-[50vh]' : 'max-h-fit'}`}
          >
            {query === '' && (
              <div>
                <h3 className="text-muted-foreground text-sm">
                  Popular Searches
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-1 text-sm text-gray-700">
              {/* Loading state */}
              {(isPending || isStale) && query.length >= 2 && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="size-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">
                    Loading suggestions...
                  </span>
                </div>
              )}

              {/* Error state */}
              {error && !isPending && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-red-600">
                  {error}
                </div>
              )}

              {/* Show "Search for" option when typing */}
              {query.length >= 2 && !isPending && !isStale && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className={`group mt-2 flex cursor-pointer items-center rounded-md border-gray-100 px-2 py-2 select-none hover:bg-yellow-600 hover:text-white ${suggestions.length > 0 && 'border-b'}`}
                >
                  <SearchIcon
                    className="size-4 flex-none text-gray-500 group-hover:text-white"
                    aria-hidden="true"
                  />
                  <span className="ml-3 flex-auto">
                    Search for{' '}
                    <span className="font-semibold">&quot;{query}&quot;</span>
                  </span>
                  <kbd className="ml-3 flex-none text-xs text-gray-400 group-hover:text-yellow-200">
                    Enter ↵
                  </kbd>
                </Link>
              )}

              {/* Suggestions list */}
              {!isPending &&
                !isStale &&
                suggestions.length > 0 &&
                suggestions.map((suggestion) => (
                  <Link
                    href={`/search?q=${encodeURIComponent(suggestion.term)}`}
                    key={suggestion.term}
                    onClick={() => setOpen(false)}
                    className="group flex cursor-pointer items-center rounded-md px-2 py-2 select-none hover:bg-yellow-600 hover:text-white"
                  >
                    <SearchIcon
                      className="size-4 flex-none text-gray-400 group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="ml-3 flex-auto truncate">
                      {suggestion.term}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <aside
        className="mx-auto overflow-hidden rounded-t-none rounded-b-2xl bg-white dark:bg-zinc-900"
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
              Work in progress, try it out😊
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
