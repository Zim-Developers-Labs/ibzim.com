import { urlForImage } from '@/sanity/lib/image';
import { formatUpdatedAt } from '@/lib/utils';
import type { CardArticleType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import Container from '../container';

const ArticleCard = ({ article }: { article: CardArticleType }) => {
  return (
    <Link
      href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
      className="group flex flex-row-reverse justify-between px-4 md:flex-col md:px-0"
    >
      <div className="mb-4 ml-4 h-20 w-32 min-w-32 overflow-hidden rounded-md md:ml-0 md:h-[112px] md:w-[200px] md:max-w-none">
        <Image
          src={
            article.seo.image
              ? `${urlForImage(article.seo.image).height(112).width(200).url()}`
              : '#'
          }
          alt={article.title}
          className="h-full w-full object-cover object-center transition-all group-hover:scale-125 group-hover:rotate-6"
          height={112}
          width={200}
        />
      </div>
      <div className="w-full">
        <div className="mb-2 block font-bold group-hover:underline">
          {article.name}
        </div>
        <div className="text-xs">{formatUpdatedAt(article._createdAt)}</div>
      </div>
    </Link>
  );
};

export default function ArticlesListing({
  articles,
  title,
}: {
  title: string;
  articles: CardArticleType[];
}) {
  return (
    <section className="py-20">
      <Container>
        <h2 className="mb-6 text-3xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {articles.map((article, i) => (
            <ArticleCard article={article} key={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
