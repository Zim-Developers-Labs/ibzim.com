import { urlForImage } from '@/sanity/lib/image';
import { CardPressArticleType } from '@/types';
import { ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type PressReleasesWrapperType = {
  articles: CardPressArticleType[];
};

export default function PressReleasesWrapper({
  articles,
}: PressReleasesWrapperType) {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-8 pb-32 lg:px-8">
      <h1 className="mt-8 text-center text-4xl">Latest IBZim News</h1>
      <ul className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard article={article} key={article._id} />
        ))}
      </ul>
    </main>
  );
}

function ArticleCard({ article }: { article: CardPressArticleType }) {
  return (
    <li className="mb-8">
      <Link
        href={`/press/${article.slug.current}`}
        className="hover:shadow-primaryColor flex items-center gap-6 rounded-xl border p-4 shadow-lg"
      >
        <div className="flex-1">
          <span className="text-sm text-zinc-600">
            {new Date(article._updatedAt).toDateString()}
          </span>
          <div className="mb-4 sm:max-w-[400px]">
            <div className="mb-4 text-2xl">{article.name}</div>
            <div className="block">
              <Image
                src={urlForImage(article.seo.image)
                  .height(675)
                  .width(1200)
                  .url()}
                alt={article.name}
                height={1200}
                width={675}
                className="mb-4 rounded-xl"
              />
            </div>
            <p className="line-clamp-3 text-zinc-800 md:line-clamp-2">
              {article.seo.description}
            </p>
          </div>
          <div className="text-primaryColor flex items-center gap-2">
            Read Press Release <ChevronRightIcon className="size-4" />
          </div>
        </div>
      </Link>
    </li>
  );
}
