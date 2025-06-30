'use client';

import { siteConfig } from '@/lib/config';
import { convertToSlug } from '@/lib/utils';
import { urlForImage } from '@/sanity/lib/image';
import { ArticlesForCountType, AuthorType } from '@/types';
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthorsCard({
  authors,
  articles,
}: {
  authors: AuthorType[];
  articles: ArticlesForCountType[];
}) {
  const getArticlesCountByAuthor = (authorName: string) => {
    return articles.filter((article) => article.author?.name == authorName)
      .length;
  };

  const sortedAuthors = [...authors].sort(
    (a, b) =>
      getArticlesCountByAuthor(b.name) - getArticlesCountByAuthor(a.name),
  );

  const [selectedAuthor, setSelectedAuthor] = useState<AuthorType>(
    sortedAuthors[0]!,
  );

  const handleAuthorClick = (author: AuthorType) => {
    setSelectedAuthor(author);
  };

  const getTimeAtIBZim = (
    dateJoined: string,
  ): { number: number | string; period: string } => {
    const joinDate = new Date(dateJoined);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - joinDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return { number: diffDays, period: 'Days' };
    } else if (diffDays < 45) {
      const diffMonths = Math.round(diffDays / 30);
      return { number: diffMonths, period: 'Month' };
    } else if (diffDays < 365) {
      const diffMonths = Math.round(diffDays / 30);
      return { number: diffMonths, period: 'Months' };
    } else {
      const diffYears = Math.round(diffDays / 365);
      return { number: diffYears, period: 'Years' };
    }
  };

  return (
    <section className="lg:flex">
      <div className="flex-1 bg-teal-300 px-4 py-8 lg:px-20 lg:py-20">
        <h2 className="mb-6 text-2xl font-bold">Our Authors</h2>
        <p className="mb-4 text-lg">
          We are working towards building a reputation as the premier source for
          trustworthy, detailed guides, reviews, case-studies and everything
          about {siteConfig.country}. If you have ever wondered about anything
          then chances are we have written something about it.
        </p>
        <Link
          href="/press/methodology"
          className="block w-fit rounded-md bg-teal-100 px-4 py-2 hover:bg-zinc-900 hover:text-yellow-400"
        >
          Learn More <ArrowRightIcon className="inline h-4 w-4" />
        </Link>
      </div>
      <div className="flex-1 bg-zinc-900 px-4 py-8 text-white lg:px-20 lg:py-20">
        <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-between">
          <Link href="/authors" className="mb-6 block text-yellow-400 md:mb-0">
            Meet the team
            <ChevronRightIcon className="inline h-4 w-fit" />
          </Link>
          <div className="mb-4 flex h-[80px] items-center gap-2 md:gap-4">
            {sortedAuthors.slice(0, 5).map((author, i) => (
              <div key={i} className="">
                <Image
                  onClick={() => handleAuthorClick(author)}
                  src={urlForImage(author.picture).height(100).width(100).url()}
                  className={`cursor-pointer rounded-full border-2 ${
                    author === selectedAuthor
                      ? 'h-[80px] w-[80px] border-yellow-400'
                      : 'h-[50px] w-[50px] border-white'
                  } transition-all`}
                  alt={author.name}
                  height={100}
                  width={100}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Link
            href={`/authors/${convertToSlug(selectedAuthor.name)}`}
            className="mb-4 block text-xl font-semibold text-teal-400"
          >
            {selectedAuthor.name}
            <ChevronRightIcon className="inline h-4 w-fit" />
          </Link>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-3xl font-bold">
                {getArticlesCountByAuthor(selectedAuthor.name)}
              </div>
              <div className="text-xs text-teal-400">
                Articles
                <br />
                Contributed
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {getTimeAtIBZim(selectedAuthor.dateJoined).number}
              </div>
              {/* Days, Months or Years */}
              <div className="text-xs text-teal-400">
                {getTimeAtIBZim(selectedAuthor.dateJoined).period}
                <br /> at IB
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
