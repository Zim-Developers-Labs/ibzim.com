import { AuthorType, CardArticleType } from '@/types';
import Link from 'next/link';
import Container from '../container';
import { ChevronRightIcon } from 'lucide-react';
import { Linkify } from '@/lib/utils';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

export default function AuthorsLayout({
  articles,
  authors,
}: {
  authors: AuthorType[];
  articles: CardArticleType[];
}) {
  const getArticlesCountByAuthor = (authorName: string) => {
    return articles.filter((article) => article.author?.name === authorName)
      .length;
  };
  const sortedAuthors = [...authors].sort(
    (a, b) =>
      getArticlesCountByAuthor(b.name) - getArticlesCountByAuthor(a.name),
  );

  return (
    <main>
      <div className="bg-zinc-900 text-white">
        <Container className="py-12 md:py-20">
          <h1 className="mb-4 text-4xl font-black text-teal-600">
            Meet the Team
          </h1>
          <p className="mb-6 text-base md:text-lg">
            IBZim expert team writes authentic articles from guide articles,
            podcasts, videos we try our best provide you with as much accurate
            and reliable information as possible.
          </p>
          <Link
            href="https://www.ibglobal.org/press/methodology"
            className="hover:border-primaryColor hover:text-primaryColor mb-8 block w-fit rounded-md border px-4 py-2"
          >
            See Methodology
            <ChevronRightIcon className="inline h-5 w-fit" />
          </Link>
          <h2 className="mb-6 text-xl font-semibold md:font-black">
            OUR LEADERSHIP
          </h2>
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            {sortedAuthors.slice(0, 3).map((author, i) => (
              <Link
                href={`/authors/${Linkify(author.name)}`}
                key={i}
                className="flex items-start gap-4 hover:text-teal-600"
              >
                <Image
                  src={urlForImage(author.picture).url()}
                  className={`h-[80px] w-[80px] rounded-full border-2 border-yellow-400 md:h-[120px] md:w-[120px]`}
                  alt={author.name}
                  height={150}
                  width={150}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{author.name}</h3>
                    <div className="rounded-md border-2 border-teal-600 px-2 text-xs">
                      {getArticlesCountByAuthor(author.name)}
                    </div>
                  </div>
                  <p className="text-primaryColor mb-2">{author.postTitle}</p>
                  <span className="text-xs">{author.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </div>
      <div>
        <Container className="py-12 md:py-20">
          <h2 className="mb-6 text-xl font-bold">CONTRIBUTERS</h2>
          <div className="flex flex-col gap-8 md:flex-row">
            {sortedAuthors.slice(3).map((author, i) => (
              <Link
                href={`/authors/${Linkify(author.name)}`}
                key={i}
                className="flex items-start gap-4 hover:text-teal-600"
              >
                <Image
                  src={urlForImage(author.picture).url()}
                  className={`h-[60px] w-[60px] rounded-full border-2 border-yellow-400 md:h-[100px] md:w-[100px]`}
                  alt={author.name}
                  height={150}
                  width={150}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{author.name}</h3>
                    <div className="rounded-md border-2 border-teal-600 px-2 text-xs">
                      {getArticlesCountByAuthor(author.name)}
                    </div>
                  </div>
                  <p className="mb-2 text-zinc-600">Contributer Writer</p>
                  <span className="text-xs">{author.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </main>
  );
}
