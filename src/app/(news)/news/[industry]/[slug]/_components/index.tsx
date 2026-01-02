import { siteConfig } from '@/lib/config';
import { urlForImage } from '@/lib/sanity/image';
import { NewsArticleType } from '@/types';
import BreadCrumb from './breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import extractTextFromBlocks, {
  calculateReadingTime,
  convertToSlug,
} from '@/lib/utils';
import HeroImage from './hero-image';
import Container from '@/components/container';
import PtRenderer from '@/components/pt-renderer';
import { Icons } from '@/components/icons';

function TimeUpdated({ article }: { article: { _updatedAt: string } }) {
  return (
    <span>
      {article && article._updatedAt
        ? new Date(article._updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : ''}
    </span>
  );
}

export default function NewsArticleComponents({
  article,
}: {
  article: NewsArticleType;
}) {
  const articleUrl = `/${article.industry}/${article.slug.current}`;

  const articleText = [
    article.title,
    article.intro,
    extractTextFromBlocks(article.body),
  ];
  const articleAsString = articleText.join(' ');

  const readingTime = calculateReadingTime(articleAsString);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.seo.title,
            datePublished: article._createdAt,
            dateModified: article._updatedAt,
            description: article.seo.description,
            image: urlForImage(article.seo.image).height(675).width(1200).url(),
            url: `${siteConfig.url.web}${articleUrl}`,
            author: {
              '@type': 'Person',
              name: article.author.name,
            },
          }),
        }}
      />
      <div className="bg-primaryColor/10 relative pb-8 md:pb-10">
        <BreadCrumb name={article.name} industry={article.industry} />
        <Container className="max-w-screen-md pt-10 md:pt-20">
          <header className="mb-8 flex flex-col">
            <div className="mr-2 mb-6 flex h-fit flex-row items-center">
              <Image
                className="mr-2 h-10 w-10 rounded-full md:h-12 md:w-12"
                src={
                  urlForImage(article.author.picture.asset)
                    .height(50)
                    .width(50)
                    .url() || '/placeholder.svg'
                }
                alt={`${article.author.name} Avatar`}
                width={50}
                height={50}
              />
              <div>
                <Link
                  href={`/authors/${convertToSlug(article.author.name)}`}
                  className="block text-sm leading-none md:text-base"
                >
                  By{' '}
                  <span className="cursor-pointer font-medium hover:underline">
                    {article.author.name}
                  </span>
                </Link>
                <span className="text-xs md:text-sm">
                  {article.author.postTitle}
                </span>
              </div>
            </div>
            <h1 className="order-second mb-6 text-3xl font-medium tracking-tight text-zinc-800 sm:text-5xl md:text-4xl md:font-bold">
              {article.title}
            </h1>
            <div className="flex flex-col justify-between md:flex-row">
              <div>
                <div className="flex items-center gap-2">
                  <div className="mb-2 w-fit rounded-sm bg-zinc-100 p-1 text-xs text-zinc-600 md:text-sm">
                    {article.industry}
                  </div>
                  <div className="mb-2 w-fit rounded-sm bg-zinc-100 p-1 text-xs text-zinc-600 md:text-sm">
                    {article.type}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <time
                    dateTime={article._updatedAt}
                    className="flex items-center text-zinc-600"
                  >
                    <TimeUpdated article={article} />
                  </time>
                  <span className="h-4 w-0.5 rounded-full bg-zinc-300" />
                  <span className="text-zinc-600">
                    {readingTime} min{readingTime !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div>
                {/* <SocialShare
                  article={article}
                  articleUrl={`${siteConfig.url.web}${articleUrl}`}
                /> */}
              </div>
            </div>
          </header>
          <p className="mb-8">{article.intro}</p>
          <HeroImage
            alt={`${article.name} | ${siteConfig.shortName}`}
            image={article.seo.image}
          />
        </Container>
      </div>
      <div className="relative">
        <Container className="mt-6 flex flex-col gap-8 pb-10 md:mt-8 md:grid md:flex-none md:grid-cols-[1fr_300px] md:pb-20">
          <div className="h-fit">
            {article && <PtRenderer body={article.body} />}
          </div>
          <SideBar />
        </Container>
      </div>
    </>
  );
}

function SideBar() {
  return (
    <aside className="h-full">
      <div className="h-full w-full md:grid md:grid-rows-[1fr_1fr_1fr]">
        <div className="relative pb-20 md:h-full md:min-h-[100vh]">
          <div className="top-[10vh] rounded-lg border border-gray-200 bg-gray-100 p-1 md:sticky md:p-2">
            <Link
              href="/calculators"
              target="_blank"
              className="block rounded-lg border border-gray-200 bg-white p-2 shadow-md md:p-4"
            >
              <Icons.toolsIcon className="mx-auto my-8 h-12 w-12 text-gray-800" />
              <div className="mx-auto mb-4 text-center text-lg font-bold">
                IBZim Calculators
              </div>
              <div className="mx-auto text-center text-sm text-gray-600">
                Try out our informative calculators: Ecocash, ZESA and more
              </div>
              <button className="mx-auto my-8 block rounded-full bg-gray-800 px-4 py-2 text-white shadow-xl">
                Try for Free
              </button>
            </Link>
          </div>
        </div>
        <div className="relative pb-20 md:h-full md:min-h-[100vh]">
          <div className="top-[10vh] rounded-lg border border-gray-200 bg-gray-100 p-1 md:sticky md:p-2">
            <Link
              href="/zimbabwe-peoples-choice-awards"
              target="_blank"
              className="block rounded-lg border border-gray-200 bg-white p-2 shadow-md md:p-4"
            >
              <Icons.ibzimAwardsIcon className="text-primaryColor mx-auto my-8 h-12 w-12" />
              <div className="mx-auto mb-4 text-center text-lg font-bold">
                IBZim Awards
              </div>
              <div className="mx-auto text-center text-sm text-gray-600">
                Join the waitlist for the upcoming IBZim Awards. Request to join
                our whatsapp groups.
              </div>
              <button className="mx-auto my-8 block rounded-full bg-gray-800 px-4 py-2 text-white shadow-xl">
                Join Waitlist
              </button>
            </Link>
          </div>
        </div>
        <div className="relative pb-20 md:h-full md:min-h-[100vh]">
          <div className="top-[10vh] rounded-lg border border-gray-200 bg-gray-100 p-1 md:sticky md:p-2">
            <Link
              href="#"
              target="_blank"
              className="block rounded-lg border border-gray-200 bg-white p-2 shadow-md md:p-4"
            >
              <Icons.zimFlagRound className="mx-auto my-8 h-12 w-12 text-gray-800" />
              <div className="mx-auto mb-4 text-center text-lg font-bold">
                Zimbabwe Government Chart
              </div>
              <div className="mx-auto text-center text-sm text-gray-600">
                Browse through our interactive chart showcasing Zimbabwe's
                government structure and key officials.
              </div>
              <button className="mx-auto my-8 block rounded-full bg-gray-800 px-4 py-2 text-white shadow-xl">
                Coming Soon
              </button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
