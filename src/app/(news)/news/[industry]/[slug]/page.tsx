import { prepareArticleMetadata } from '@/lib/article-metadata';
import {
  getAllNewsArticleSlugsAndIndustries,
  getNewsArticleBySlug,
} from '@/lib/sanity/client';
import { urlForImage } from '@/lib/sanity/image';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsArticleComponents from './_components';

type Props = {
  params: Promise<{ industry: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  return prepareArticleMetadata({
    title: article?.seo.title,
    description: article?.seo.description,
    pageUrl: `/${industry}/${slug}`,
    ogImage: {
      url: urlForImage(article?.seo.image)
        .height(675)
        .width(1200)
        .fit('crop')
        .url(),
      height: 675,
      width: 1200,
    },
    author: {
      name: article?.author.name,
      url: article?.author.links.website,
    },
  });
}

export async function generateStaticParams() {
  const articles = await getAllNewsArticleSlugsAndIndustries();

  return (await articles).map((article) => ({
    industry: article.industry,
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await getNewsArticleBySlug(slug);

  if (!article?._id) {
    return notFound();
  }

  return <NewsArticleComponents article={article} />;
}
