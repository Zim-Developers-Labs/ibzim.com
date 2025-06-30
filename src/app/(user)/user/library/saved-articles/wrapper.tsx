'use client';

import { useState } from 'react';
import { User } from 'lucia';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Image from 'next/image';
import { saveArticle } from './actions';
import { urlForImage } from '@/sanity/lib/image';
import { Icons } from '@/components/icons';

export default function SavedArticlesWrapper({
  user,
  savedArticles,
}: {
  user: User;
  savedArticles?: any[];
}) {
  const [savedArticlesState, setSavedArticlesState] = useState(
    savedArticles || [],
  );
  const [unsavingArticleId, setUnsavingArticleId] = useState<string | null>(
    null,
  );

  const handleUnsave = async (articleId: string) => {
    try {
      setUnsavingArticleId(articleId);
      await saveArticle(user.id, articleId);
      setSavedArticlesState((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId),
      );
    } catch (error) {
      console.error('Error unsaving article:', error);
      // Optionally, you can add error handling UI here
    } finally {
      setUnsavingArticleId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {savedArticlesState.length} items in Library
      </h3>

      {savedArticlesState.length === 0 ? (
        <Alert />
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {savedArticlesState.map((article: any) => (
            <li
              key={article._id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
            >
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {article.name}
                    </h3>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {article.seo.description}
                  </p>
                </div>
                <Image
                  className="h-[50px] w-[89px] flex-shrink-0 rounded-md bg-gray-300"
                  src={urlForImage(article.seo.image)
                    .height(50)
                    .width(89)
                    .url()}
                  alt={article.seo.description}
                  width={89}
                  height={50}
                />
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <Link
                      href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      target="_blank"
                    >
                      Read
                    </Link>
                  </div>
                  <div className="-ml-px flex w-0 flex-1">
                    <button
                      onClick={() => handleUnsave(article._id)}
                      disabled={unsavingArticleId === article._id}
                      className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500 disabled:opacity-50"
                    >
                      {unsavingArticleId === article._id ? (
                        <>
                          <Icons.animatedSpinner className="mr-2 h-4 w-4" />
                          Unsaving...
                        </>
                      ) : (
                        'Unsave'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Alert() {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">
            You have no items in your saved articles list. A library helps you
            find the articles you love easily
          </p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <Link
              href="/"
              className="font-medium whitespace-nowrap text-blue-700 hover:text-blue-600"
            >
              Explore
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
