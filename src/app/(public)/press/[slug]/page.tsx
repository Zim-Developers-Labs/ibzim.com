import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleLayout from "./wrapper";
import { PressArticleType } from "@/types";
import {
  getAllPressArticleSlugs,
  getPressArticleBySlug,
} from "@/sanity/lib/client";
import { prepareArticleMetadata } from "@/lib/article-metadata";
import { urlForImage } from "@/sanity/lib/image";
import { siteConfig } from "@/lib/config";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [article]: [PressArticleType | null] = await Promise.all([
    getPressArticleBySlug((await params).slug),
  ]);

  return prepareArticleMetadata({
    title: article?.seo.title,
    description: article?.seo.description,
    pageUrl: `/press/${(await params).slug}`,
    ogImage: {
      url: urlForImage(article?.seo.image || "")
        .height(675)
        .width(1200)
        .url(),
      height: 675,
      width: 1200,
    },
    siteConfig: siteConfig,
  });
}

export async function generateStaticParams() {
  const articles = await getAllPressArticleSlugs();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function PressArticle({ params }: Props) {
  const { slug } = await params;
  const [article]: [PressArticleType | null] = await Promise.all([
    getPressArticleBySlug(slug),
  ]);

  if (!article?._id) {
    return notFound();
  }

  return <ArticleLayout article={article} />;
}
