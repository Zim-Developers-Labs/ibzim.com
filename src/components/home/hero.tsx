import { urlForImage } from '@/sanity/lib/image';
import type { CardArticleType, SiteConfigType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

const PinnedLists = ({
  pinnedRankingArticles,
  siteConfig,
}: {
  pinnedRankingArticles: CardArticleType[];
  siteConfig: SiteConfigType;
}) => {
  return (
    <div className="flex h-fit flex-col bg-teal-200 p-4 md:flex-row md:rounded-xl xl:max-w-[250px] xl:min-w-[250px] xl:flex-col">
      <h2 className="mr-4 mb-6 text-sm md:mb-0 xl:mr-0 xl:mb-6">
        Best&nbsp;of&nbsp;the <br />
        <span className="mb-0 text-3xl font-black">Best</span>
        <br />
        <span className="whitespace-nowrap">
          All&nbsp;about&nbsp;{siteConfig.country}
        </span>
      </h2>
      <ul className="flex flex-col md:flex-row md:items-center xl:flex-col">
        {pinnedRankingArticles.map((article, i) => {
          // Temporary fix for schools listing articles
          // These articles have been moved to the school picker tool
          // This is a temporary fix until we can update the links in the articles
          const getArticleHref = () => {
            if (
              article.slug.current === 'top-20-best-universities-in-zimbabwe'
            ) {
              return '/tools/school-picker/best-tertiary-institutions-in-zimbabwe';
            }

            if (
              article.slug.current ===
              'top-100-best-a-level-schools-in-zimbabwe'
            ) {
              return '/tools/school-picker/best-a-level-schools-in-zimbabwe';
            }

            if (
              article.slug.current ===
              'top-100-best-o-level-schools-in-zimbabwe'
            ) {
              return '/tools/school-picker/best-o-level-schools-in-zimbabwe';
            }
            if (
              article.slug.current ===
              'top-100-best-primary-schools-in-zimbabwe'
            ) {
              return '/tools/school-picker/best-primary-schools-in-zimbabwe';
            }

            // Return default href for all other articles
            return `/${article.industry.slug}/${article.type}/${article.slug.current}`;
          };

          return (
            <li
              key={i}
              className="border-t border-dashed border-zinc-900 py-4 md:border-t-0 md:border-l md:px-4 md:py-0 xl:border-t xl:border-l-0 xl:px-0 xl:py-4"
            >
              <Link
                className="text-sm font-bold hover:underline"
                href={getArticleHref()}
              >
                {article.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

type HeroProps = {
  heroArticle: CardArticleType;
  pinnedRankingArticles: CardArticleType[];
  latestArticles: CardArticleType[];
  siteConfig: SiteConfigType;
};

const ArticleCard = ({ article }: { article: CardArticleType }) => {
  return (
    <Link
      href={`/${article.industry.slug}/${article.type}/${article.slug.current}`}
      className="group flex flex-row-reverse justify-between px-4 lg:flex-col lg:px-0"
    >
      <div className="mb-4 ml-4 h-20 w-32 min-w-32 overflow-hidden rounded-md lg:ml-0 lg:h-[112px] lg:w-[200px] lg:max-w-none">
        <Image
          src={urlForImage(article.seo.image).width(200).height(112).url()}
          alt={article.title}
          className="h-full w-full object-cover object-center transition-all group-hover:scale-125 group-hover:rotate-6"
          height={1200}
          width={675}
        />
      </div>
      <div>
        <div className="mb-2 block font-bold group-hover:underline">
          {article.name}
        </div>
        <div className="text-xs">
          By <span className="font-bold">{article.author.name}</span>
        </div>
      </div>
    </Link>
  );
};

export default function Hero({
  heroArticle,
  latestArticles,
  pinnedRankingArticles,
  siteConfig,
}: HeroProps) {
  return (
    <section className="md:py-10">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col-reverse gap-8 px-0 md:px-8 lg:px-12 xl:flex-row">
        <PinnedLists
          siteConfig={siteConfig}
          pinnedRankingArticles={pinnedRankingArticles}
        />
        <div>
          <Link
            href={`/${heroArticle.industry.slug}/${heroArticle.type}/${heroArticle.slug.current}`}
            className="group mb-4 flex flex-col md:flex-row"
          >
            <div className="aspect-[16/9] max-w-[500px] flex-2 overflow-hidden md:rounded-tl-xl md:rounded-bl-xl">
              <Image
                src={urlForImage(heroArticle.seo.image)
                  .width(500)
                  .height(281)
                  .url()}
                alt={`${heroArticle.seo.title} | ${siteConfig.shortName}`}
                className="h-full w-full transition-all group-hover:scale-125 group-hover:rotate-6"
                height={281}
                width={500}
              />
            </div>
            <div className="flex-1 bg-yellow-400 p-6 group-hover:bg-teal-400 md:rounded-tr-xl md:rounded-br-xl">
              <div className="mb-4 text-sm capitalize">
                {heroArticle.industry.slug}
              </div>
              <h3 className="mb-4 text-2xl font-bold group-hover:underline">
                {heroArticle.name}
              </h3>
              <p className="mb-4">{heroArticle.seo.description}</p>
              <div className="text-sm">
                By <span className="font-bold">{heroArticle.author.name}</span>
              </div>
            </div>
          </Link>
          <div className="flex flex-col gap-4 lg:flex-row">
            {latestArticles.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
