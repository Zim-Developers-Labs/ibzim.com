"use client";

import Link from "next/link";
import { Fragment } from "react";
import Image from "next/image";
import { PressArticleType } from "@/types";
import { Icons } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis, LinkIcon, Mail } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { toast } from "sonner";
import { urlForImage } from "@/sanity/lib/image";
import extractTextFromBlocks, { calculateReadingTime } from "@/lib/utils";
import PtRenderer from "@/components/pt-renderer";

function BreadCrumb({ name }: { name: string }) {
  return (
    <div className="border-y border-b-gray-200 w-full mb-4">
      <div className="text-[.8rem] line-clamp-1 leading-8">
        <Link href="/" className="hover:text-primaryColor">
          Home &nbsp;
        </Link>{" "}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <Link href="/press" className="hover:text-primaryColor">
          Press &nbsp;
        </Link>{" "}
        <span className="text-gray-400">/</span>
        &nbsp;&nbsp;
        <span>{name}</span>
      </div>
    </div>
  );
}

const TimeUpdated: React.FC<{ article: { _updatedAt?: string } }> = ({
  article,
}) => {
  return (
    <span>
      {article && article._updatedAt
        ? new Date(article._updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : ""}
    </span>
  );
};

function SocialShare({
  articleUrl,
  article,
}: {
  articleUrl: string;
  article: PressArticleType;
}) {
  return (
    <div className="flex flex-col mt-6 md:mt-0">
      <span className="text-xs text-zinc-600 hidden md:block">SHARE ON:</span>
      <div className="flex justify-between md:gap-6 items-center max-w-[250px]">
        <button
          onClick={() => {
            window.open(
              `https://api.whatsapp.com/send?text=*${article.name}* _${article.seo.description}_ ${articleUrl}`,
              "_blank"
            );
          }}
          aria-label="Share On Facebook"
        >
          <Icons.whatsapp className="text-zinc-900 h-5 w-fit hover:text-primaryColor" />
        </button>
        <button
          onClick={() => {
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`,
              "_blank"
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
              "_blank"
            );
          }}
          className="hover:text-primaryColor"
        >
          <Icons.twitter className="w-4 h-4" />
        </button>
        <button
          aria-label="Share On Pinterest"
          onClick={() => {
            window.open(
              `https://pinterest.com/pin/create/button/?url=${articleUrl}&description=${article.name}`,
              "_blank"
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
              "_blank"
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
                    "_blank"
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
                    "_blank"
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
                  toast.success("Copied to clipboard");
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

function HeroImage(props: any) {
  const { alt, image, imageCredits } = props;

  const imageUrl =
    image && urlForImage(image)?.width(800).height(450).fit("crop").url();

  return (
    <div className="p-2 md:p-8 border border-gray-200 rounded-lg my-8">
      <div className="mb-1 block rounded-xl">
        {image && (
          <Image
            src={imageUrl}
            alt={alt}
            className="h-auto w-full rounded-xl shadow-xl"
            decoding="sync"
            title={alt}
            height={450}
            width={800}
            priority
          />
        )}
      </div>
      {imageCredits && (
        <small className="text-zinc-600">
          {"("}Image Credit: {imageCredits}
          {")"}
        </small>
      )}
    </div>
  );
}

function TblContents({ article }: { article: PressArticleType }) {
  return (
    <div className="mb-5 w-full rounded-md border border-zinc-300 bg-zinc-100  text-sm">
      <span className="mb-3 block border-b border-zinc-300 p-3 text-center text-lg font-[500] md:p-8">
        Table of Contents
      </span>
      <div className="p-3 md:p-8">
        <nav id="tbl_contents">
          {article.subHeadings?.map((subHeading, index: any) => (
            <Link
              key={index}
              href={`#${encodeURIComponent(subHeading.title)}`}
              className="line mb-4 flex items-center text-[15px] hover:font-semibold hover:text-teal-700"
            >
              {subHeading.type === "h2" && (
                <div className="mr-2 h-4 w-4">
                  <LinkIcon className="h-4 w-4" />
                </div>
              )}

              {subHeading.type === "h3" && (
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              )}
              {subHeading.type === "h4" && (
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </>
              )}

              <span>{subHeading.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function ArticleLayout({
  article,
}: {
  article: PressArticleType;
}) {
  const articleText = [
    article.title,
    article.intro,
    extractTextFromBlocks(article.body),
  ];
  const articleAsString = articleText.join(" ");
  const readingTime = calculateReadingTime(articleAsString);

  return (
    <>
      <div className="relative w-full px-4 sm:px-8 lg:px-12 mx-auto py-10 md:py-20 max-w-screen-md">
        <article>
          <header className="mb-8 flex flex-col">
            <BreadCrumb name={article.name} />
            <h1 className="order-second mb-6 text-3xl md:text-4xl font-medium md:font-bold tracking-tight text-zinc-800 sm:text-5xl">
              {article.title}
            </h1>
            <div className="flex justify-between flex-col md:flex-row">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-zinc-200 text-zinc-500 rounded-sm w-fit p-1 text-xs md:text-sm">
                    Press
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
                      {readingTime} min{readingTime !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <SocialShare
                  article={article}
                  articleUrl={`https://www.ibglobal.org/press/${article.slug.current}`}
                />
              </div>
            </div>
          </header>
          <p className="mb-8">{article.intro}</p>
          <HeroImage
            alt={`${article.name} | IBGlobal`}
            image={article.seo.image}
          />
          {article?.subHeadings && <TblContents article={article} />}
          <PtRenderer body={article.body} />
        </article>
      </div>
    </>
  );
}
