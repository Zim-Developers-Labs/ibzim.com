'use client';

import { ChevronRightIcon, Search } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SearchToggler({
  articles,
  popularArticles,
}: {
  articles?: any[];
  popularArticles?: any[];
}) {
  const [query, setQuery] = useState('');

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

  const popularSearches = ['schools', 'starlink', 'whatsapp', 'money'];

  const filteredArticles: any =
    query === ''
      ? []
      : articles?.filter((article: any) => {
          const lowercaseQuery = query.toLowerCase();
          return (
            article.name.toLowerCase().includes(lowercaseQuery) ||
            (article.title &&
              article.title.toLowerCase().includes(lowercaseQuery)) ||
            (article.seo?.description &&
              article.seo.description.toLowerCase().includes(lowercaseQuery))
          );
        });

  return (
    <Dialog>
      <DialogTrigger className="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-200 p-1 md:px-4 md:py-2">
        <Search className="size-5 text-zinc-600" />
        <div className="hidden pr-2 text-xs text-zinc-700 md:block">
          Search/Request Articles
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
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

        <div className="max-h-80 scroll-py-2 space-y-4 overflow-y-auto">
          <div>
            <h3 className="text-muted-foreground text-sm">Popular Searches</h3>
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

          <div className="space-y-2 text-sm text-gray-700">
            {query !== '' &&
              filteredArticles.length > 0 &&
              filteredArticles.map((article: any, i: number) => {
                const url =
                  article._type == 'article'
                    ? `/${article.industry.slug}/${article.type}/${article.slug.current}`
                    : `/profiles/${article.entityType}/${article.slug.current}`;

                return (
                  <Link
                    href={url}
                    key={i}
                    className="group flex cursor-default items-center rounded-md px-3 py-2 select-none hover:bg-yellow-600 hover:text-white hover:outline-none"
                  >
                    <ChevronRightIcon
                      className="h-6 w-6 flex-none text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-3 flex-auto truncate">
                      {article.name}
                    </span>
                    <span className="ml-3 flex-none text-xs font-semibold text-white">
                      Read
                    </span>
                  </Link>
                );
              })}
          </div>

          {query == '' && (
            <>
              <h2 className="sr-only">Popular Articles</h2>
              <div className="space-y-2 text-sm text-gray-700">
                {popularArticles?.map((article, index) => (
                  <Link
                    href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
                    key={index}
                    className="group flex cursor-default items-center rounded-md px-3 py-2 select-none hover:bg-yellow-600 hover:text-white hover:outline-none"
                  >
                    <ChevronRightIcon
                      className="h-6 w-6 flex-none text-gray-400 group-hover:text-white group-hover:forced-colors:text-[Highlight]"
                      aria-hidden="true"
                    />
                    <span className="ml-3 flex-auto truncate">
                      {article.name}
                    </span>
                    <span className="ml-3 flex-none text-xs font-semibold text-white">
                      Read
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {query !== '' && filteredArticles?.length === 0 && (
            <div className="px-6 py-14 text-center sm:px-14">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No results found
              </h3>
              <p className="mx-auto mt-1 max-w-[400px] text-center text-sm text-gray-500">
                We couldn&#39;t find any articles matching your search. Send
                your search query to us by clicking the button below.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleRequestContent}
                  type="button"
                  className="bg-primaryColor hover:bg-primaryColor/90 focus:ring-primaryColor inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  Request Content
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
