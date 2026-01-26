'use client';

import { ChevronRightIcon, Search, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SearchToggler({ documents }: { documents?: any[] }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const handleRequestContent = async () => {
    if (query.length < 5) {
      toast.error('Add more details to your query');
      return;
    }
    const phoneNumber = '263717238876';
    const message = encodeURIComponent(`Hi I would like content on: ${query}`);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  const popularSearches = ['schools', 'starlink', 'rich'];

  const filteredArticles: any =
    query === ''
      ? []
      : documents?.filter((document: any) => {
          const lowercaseQuery = query.toLowerCase();
          return (
            document.name.toLowerCase().includes(lowercaseQuery) ||
            (document.title &&
              document.title.toLowerCase().includes(lowercaseQuery)) ||
            (document.seo?.description &&
              document.seo.description.toLowerCase().includes(lowercaseQuery))
          );
        });

  return (
    <div className="block w-full max-w-2xl">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-fit w-full cursor-pointer rounded-t-3xl rounded-b-none border-zinc-200 bg-white py-5 text-base hover:bg-zinc-50"
          >
            <Search className="size-5 text-zinc-600" />
            <div className="pr-2 text-sm text-zinc-600">
              Search/Request Information
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="top-32 translate-y-0 sm:top-32 sm:max-w-xl sm:translate-y-0">
          <DialogTitle className="sr-only">Search Articles</DialogTitle>
          <div className="flex items-center border-b pb-4">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              type="text"
              placeholder="Search..."
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
                      className="rounded bg-gray-700 px-3 py-1 text-sm text-white"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 text-sm text-gray-700">
              {query !== '' &&
                filteredArticles.length > 0 &&
                filteredArticles.map((document: any, i: number) => {
                  const url = `/search?q=${encodeURIComponent(document.name)}`;
                  return (
                    <Link
                      href={url}
                      key={i}
                      onClick={handleLinkClick}
                      className="group flex cursor-default items-center rounded-md px-3 py-2 select-none hover:bg-yellow-600 hover:text-white hover:outline-none"
                    >
                      <SearchIcon
                        className="size-4 flex-none text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-3 flex-auto truncate">
                        {document.name}
                      </span>
                      <span className="ml-3 flex-none text-xs font-semibold text-white">
                        Search
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <aside
        className="mx-auto overflow-hidden rounded-t-none rounded-b-2xl bg-white"
        role="banner"
      >
        <div className="relative isolate flex items-center justify-center gap-x-2 overflow-hidden bg-yellow-500/50 px-6 py-2.5 sm:px-3.5 md:gap-x-6">
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
            <p className="text-xs text-gray-800">
              Work in progress, try it out😊
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
