'use client';

import { Search, SearchIcon, Loader2 } from 'lucide-react';
import {
  useState,
  useEffect,
  useDeferredValue,
  useTransition,
  useRef,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getQuerySuggestions,
  type QuerySuggestion,
} from '@/lib/meilisearch/actions';

export default function SERPSearchToggler({ q }: { q: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(q);
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // useDeferredValue for automatic debouncing (React 19)
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // Update query when q prop changes (e.g., navigating to different search)
  useEffect(() => {
    setQuery(q);
  }, [q]);

  // Navigate to search page with query
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    }
    if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // Fetch suggestions when deferred query changes
  useEffect(() => {
    if (deferredQuery.trim().length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    startTransition(async () => {
      const response = await getQuerySuggestions(deferredQuery);
      setSuggestions(response.suggestions);
      setError(response.error ?? null);
    });
  }, [deferredQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showSuggestions = isFocused && query.length >= 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center rounded-lg border bg-white px-3 py-2 focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500 dark:bg-zinc-700">
        <Search className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
        <input
          type="text"
          placeholder="Search Zimbabwe..."
          className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border bg-white py-2 shadow-lg dark:bg-zinc-700">
          {/* Loading state */}
          {(isPending || isStale) && (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="size-4 animate-spin text-gray-400 dark:text-zinc-500" />
              <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-300">
                Loading suggestions...
              </span>
            </div>
          )}

          {/* Error state */}
          {error && !isPending && (
            <div className="mx-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Search for option */}
          {!isPending && !isStale && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setIsFocused(false)}
              className={`group flex cursor-pointer items-center px-3 py-2 text-sm select-none hover:bg-yellow-600 hover:text-white ${suggestions.length > 0 ? 'border-b' : ''}`}
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
            suggestions.map((suggestion) => (
              <Link
                href={`/search?q=${encodeURIComponent(suggestion.title)}`}
                key={suggestion.id}
                onClick={() => setIsFocused(false)}
                className="group flex cursor-pointer items-center px-3 py-2 text-sm select-none hover:bg-yellow-600 hover:text-white"
              >
                <SearchIcon
                  className="size-4 flex-none text-gray-400 group-hover:text-white"
                  aria-hidden="true"
                />
                <span className="ml-3 flex-auto truncate">
                  {suggestion.title}
                </span>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
