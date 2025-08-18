import Container from '@/components/container';
import { urlForImage } from '@/sanity/lib/image';
import { formatUpdatedAt } from '@/lib/utils';
import { AuthorType, CardArticleType } from '@/types';
import { ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { deploymentDomain } from '@/lib/config';

const ArticleCard = ({ article }: { article: CardArticleType }) => {
  const domains = {
    article: {
      production: `https://${deploymentDomain}`,
      development: 'localhost:5001',
    },
    'sa.article': {
      production: 'https://www.iblogsa.com',
      development: 'localhost:5002',
    },
    'ng.article': {
      production: 'https://www.iblogng.com',
      development: 'localhost:5003',
    },
    'afr.article': {
      production: 'https://www.iblogafrica.com',
      development: 'localhost:5004',
    },
    'gh.article': {
      production: 'https://www.ibgan.com',
      development: 'localhost:5005',
    },
    'ke.article': {
      production: 'https://www.ibnya.com',
      development: 'localhost:5006',
    },
    'uk.article': {
      production: 'https://www.ibloguk.com',
      development: 'localhost:5007',
    },
  };

  const domain =
    process.env.NODE_ENV == 'production'
      ? // @ts-expect-error -- type error
        domains[article._type]?.production
      : // @ts-expect-error -- type error
        domains[article._type]?.development;

  return (
    <li>
      <Link
        href={`${domain}/${article.industry.slug}/${article.type}/${article.slug.current}`}
        className="group flex flex-row-reverse justify-between px-4 md:flex-col md:px-0"
      >
        <div className="mb-4 ml-4 aspect-[16/9] max-w-[150px] overflow-hidden rounded-md md:ml-0 md:max-w-none">
          <Image
            src={urlForImage(article.seo.image).url()}
            alt={article.title}
            className="h-auto w-full transition-all group-hover:scale-125 group-hover:rotate-6"
            height={1200}
            width={675}
          />
        </div>
        <div>
          <div className="mb-2 block font-bold group-hover:underline">
            {article.name}
          </div>
          <div className="text-xs">{formatUpdatedAt(article._updatedAt)}</div>
        </div>
      </Link>
    </li>
  );
};

export default function AuthorLayout({
  articles,
  author,
}: {
  articles: CardArticleType[];
  author: AuthorType;
}) {
  return (
    <main>
      <div className="bg-zinc-900 py-12 text-white md:py-20">
        <Container className="flex gap-8">
          <Image
            src={urlForImage(author.picture).url()}
            className={`h-[80px] w-[80px] rounded-lg border-2 border-white md:h-[200px] md:w-[200px]`}
            alt={author.name}
            height={300}
            width={300}
          />
          <div>
            <div className="text-xs">
              <span>IBZim</span>
              <ChevronRightIcon className="inline h-3 w-fit" />
              <span>Authors</span>
              <ChevronRightIcon className="hidden h-3 w-fit md:inline" />
              <span className="hidden md:inline">
                {author.name}&#39;s Profile
              </span>
            </div>
            <h1 className="my-4 text-3xl font-black text-teal-600 md:text-4xl">
              {author.name}
            </h1>
            <p className="text-md mb-4 md:text-lg">{author.postTitle}</p>
            <p className="text-sm text-zinc-300 md:text-base">{author.bio}</p>
          </div>
        </Container>
      </div>
      <div className="bg-zinc-800 py-12 text-white md:py-20">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:divide-x-2">
            <div className="border-l-2 pl-8 md:border-l-0 md:pr-8 md:pl-0">
              <div className="text-primaryColor text-xs md:text-sm">
                IB Member Since
              </div>
              <div className="text-2xl font-bold">
                {new Date(author.dateJoined).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="border-l-2 pl-8 md:border-l-0 md:pr-8 md:pl-0">
              <div className="text-primaryColor text-xs md:text-sm">
                Location
              </div>
              <div className="text-2xl font-bold">{author.location}</div>
            </div>
            <div className="border-l-2 pl-8 md:border-none md:pl-0">
              <div className="text-primaryColor text-xs md:text-sm">
                Articles Contributed
              </div>
              <div className="text-2xl font-bold">{articles.length}</div>
            </div>
          </div>
        </Container>
      </div>
      <div className="py-12 md:py-20">
        <Container>
          <h2 className="mb-6 text-2xl font-bold uppercase md:text-3xl">
            Latest from {author.name.split(' ')[0]}
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {articles.map((article, i) => (
              <ArticleCard article={article} key={i} />
            ))}
          </ul>
        </Container>
      </div>
    </main>
  );
}
