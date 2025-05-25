'use client';

import type { ArticleType } from '@/types';
import { siteConfig } from '@/lib/config';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bookmark,
  Ellipsis,
  LinkIcon,
  Mail,
  MessageSquareText,
} from 'lucide-react';
import { toast } from 'sonner';
import extractTextFromBlocks, {
  calculateReadingTime,
  Linkify,
} from '@/lib/utils';
import BreadCrumb from './components/breadcrumb';
import { urlForImage } from '@/sanity/lib/image';
import ProfileTruthScore from '../truth-score';
import HeroImage from './components/hero-image';
import ProductListing from './components/product-listing';
import { ArticleTblContents } from './components/tbl-contents';
import RelatedArticles from './components/related-articles';
import { Icons } from '../icons';
import Container from '../container';
import PtRenderer from '../pt-renderer';
import CommentSection from '../comments';
import Link from 'next/link';
import { CommentWithChildren } from '../comments/comments-lib';
import { CommentType } from '@/server/db/schema';
import { useEffect, useState } from 'react';
import { getClaps, toggleClap } from './clap';
import { getSavedArticles, saveArticle } from './save';

export type ArticleLayoutProps = {
  article: ArticleType;
  user: any;
  parentComments?: CommentWithChildren[];
  allComments?: CommentType[];
};

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

function SocialShare({
  articleUrl,
  article,
}: {
  articleUrl: string;
  article: ArticleType;
}) {
  return (
    <div className="mt-6 flex flex-col md:mt-0">
      <span className="hidden text-xs text-zinc-600 md:block">SHARE ON:</span>
      <div className="flex max-w-[250px] items-center justify-between md:gap-6">
        <button
          onClick={() => {
            window.open(
              `https://api.whatsapp.com/send?text=*${article.name}* _${article.seo.description}_ ${articleUrl}`,
              '_blank',
            );
          }}
          aria-label="Share On Facebook"
        >
          <Icons.whatsapp className="hover:text-primaryColor h-5 w-fit text-zinc-900" />
        </button>
        <button
          onClick={() => {
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`,
              '_blank',
            );
          }}
          aria-label="Share On Facebook"
          className="hover:text-primaryColor"
        >
          <Icons.facebookF />
        </button>
        <button
          aria-label="Share On Twitter"
          onClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?text=${article.name}&url=${articleUrl}&hashtags=${siteConfig.shortName}`,
              '_blank',
            );
          }}
          className="hover:text-primaryColor"
        >
          <Icons.twitter className="h-4 w-4" />
        </button>
        <button
          aria-label="Share On Pinterest"
          onClick={() => {
            window.open(
              `https://pinterest.com/pin/create/button/?url=${articleUrl}&description=${article.name}`,
              '_blank',
            );
          }}
          className="hover:text-primaryColor"
        >
          <Icons.pinterestP />
        </button>
        <button
          aria-label="Share On LinkedIn"
          onClick={() => {
            window.open(
              `https://www.linkedin.com/shareArticle?mini=true&url=${articleUrl}&title=${article.name}`,
              '_blank',
            );
          }}
          className="hover:text-primaryColor"
        >
          <Icons.linkedinIn />
        </button>
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label="More Share Options"
              className="grid place-content-center"
            >
              <Ellipsis className="hover:text-primaryColor h-6 w-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="max-w-[150px]">
            <div className="">
              <div
                onClick={() => {
                  window.open(
                    `https://www.reddit.com/submit?url=${articleUrl}&title=${article.title}`,
                    '_blank',
                  );
                }}
                className={`group hover:text-primaryColor flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm`}
              >
                <Icons.reddit aria-hidden="true" className="mr-2 h-4 w-4" />
                Reddit
              </div>
              <div
                onClick={() => {
                  window.open(
                    `mailto:?subject=${article.name}&body=${articleUrl}`,
                    '_blank',
                  );
                }}
                className={`group hover:text-primaryColor flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm`}
              >
                <Mail aria-hidden="true" className="mr-2 h-4 w-4" />
                Mail
              </div>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(articleUrl);
                  toast.success('Copied to clipboard');
                }}
                className={`group hover:text-primaryColor flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm`}
              >
                <LinkIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                Copy Link
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default function ArticleWrapper({
  article,
  user,
  allComments,
  parentComments,
}: ArticleLayoutProps) {
  const [claps, setClaps] = useState(0);
  const [userClapped, setUserClapped] = useState(false);
  const [isClapping, setIsClapping] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getClaps(article._id, user?.id).then((result: any) => {
      if (result.success) {
        setClaps(result.claps);
        setUserClapped(result.userClapped);
      }
    });

    if (user) {
      getSavedArticles(user.id).then((result) => {
        if (!result.error && result.allSavedArticles) {
          const isArticleSaved = result.allSavedArticles.some(
            (savedArticle) => savedArticle.articleId === article._id,
          );
          setIsSaved(isArticleSaved);
        }
      });
    }
  }, [article?._id, user, user?.id]);

  const handleClap = async () => {
    if (isClapping) return;
    setIsClapping(true);
    const result: any = await toggleClap(article._id, user.id);
    if (result.success) {
      setClaps(result.claps);
      setUserClapped(result.userClapped);
    }
    setIsClapping(false);
  };

  const handleSaveArticle = async () => {
    if (!user) {
      toast.error('Please log in to save articles');
      return;
    }

    setIsSaving(true);
    try {
      await saveArticle(user.id, article._id);
      setIsSaved(!isSaved);
      toast.success(
        isSaved ? 'Article removed from library' : 'Article saved to library',
      );
    } catch (error) {
      toast.error(`Error saving article: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  const articleUrl = `/${article.industry.slug}/${article.type}/${article.slug.current}`;
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
            '@type': 'BlogPosting',
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
      <BreadCrumb
        name={article.name}
        industry={article.industry.slug}
        type={article.type}
      />
      <Container className="max-w-screen-md py-10 md:py-20">
        <article role="main">
          <header className="mb-8 flex flex-col">
            <div className="mr-2 mb-6 flex h-fit flex-row items-center">
              <img
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
                  href={`/authors/${Linkify(article.author.name)}`}
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
                    {article.industry.slug}
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
                <SocialShare
                  article={article}
                  articleUrl={`${siteConfig.url.web}${articleUrl}`}
                />
              </div>
            </div>
          </header>
          <div className="mb-8 flex justify-between border border-t border-r-0 border-b border-l-0 border-gray-200 px-2 py-3">
            <div className="flex items-center text-gray-600 sm:gap-2">
              {user ? (
                <button
                  onClick={handleClap}
                  disabled={isClapping || !user}
                  className={`${!isClapping && 'cursor-pointer hover:-translate-y-1'}`}
                >
                  {userClapped ? (
                    <Icons.clapHandsSolid className="text-primaryColor h-5 w-fit" />
                  ) : (
                    <Icons.clapHands className="h-5 w-fit" title="Clap" />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    toast.error('Login/Signup first to clap for article');
                  }}
                >
                  <Icons.clapHands className="h-5 w-fit" title="Clap" />
                </button>
              )}
              <span className="text-xs" aria-label="Article Claps Count">
                {isClapping
                  ? userClapped
                    ? 'removing...'
                    : 'clapping...'
                  : claps}
              </span>
              <Link
                href="#commentSection"
                className="group flex items-center gap-2"
              >
                <MessageSquareText
                  strokeWidth={1.5}
                  className="ml-4 h-5 w-fit cursor-pointer group-hover:-translate-y-1"
                />
                <span className="text-xs" aria-label="Article Comments Count">
                  {allComments ? allComments.length : 0}
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="group flex cursor-pointer items-center gap-2 text-gray-600"
                onClick={handleSaveArticle}
              >
                <span className="text-xs">
                  {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </span>
                {isSaved ? (
                  <Bookmark className="fill-primaryColor text-primaryColor h-5 w-fit transition-transform group-hover:-translate-y-1" />
                ) : (
                  <Bookmark className="h-5 w-fit transition-transform group-hover:-translate-y-1" />
                )}
              </div>
              <ProfileTruthScore
                score={article.truthScore ? article.truthScore : 0}
                type="article"
              />
            </div>
          </div>
          <p className="mb-8">{article.intro}</p>
          <HeroImage
            alt={`${article.name} | ${siteConfig.shortName}`}
            image={article.seo.image}
          />
          {article?.products && <ProductListing articleProducts={article} />}
          {article?.tblContentsType && (
            <div className="md:mt-24">
              {article.tblContentsType == 'auto' ||
              article.tblContentsType == 'manual' ? (
                <ArticleTblContents article={article} />
              ) : null}
            </div>
          )}
          {article && <PtRenderer body={article.body} />}
        </article>
      </Container>
      <RelatedArticles articles={article.relatedArticles!} />
      <CommentSection
        user={user}
        articleId={article._id}
        allComments={allComments}
        parentComments={parentComments}
        article={article}
        claps={claps}
        handleClap={handleClap}
        isClapping={isClapping}
        userClapped={userClapped}
      />
    </>
  );
}
