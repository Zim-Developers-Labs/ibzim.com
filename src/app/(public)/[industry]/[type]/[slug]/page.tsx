import { prepareArticleMetadata } from '@/lib/article-metadata';
import {
  getAllArticleSlugsAndTypesAndIndustries,
  getArticleBySlug,
} from '@/lib/sanity/client';
import { urlForImage } from '@/lib/sanity/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleComponents from './_components';

type Props = {
  params: Promise<{ industry: string; type: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, slug, type } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return prepareArticleMetadata({
    title: article.seo.title,
    description: article.seo.description,
    pageUrl: `/${industry}/${type}/${slug}`,
    ogImage: {
      url: urlForImage(article.seo.image)
        .height(675)
        .width(1200)
        .fit('crop')
        .url(),
      height: 675,
      width: 1200,
    },
    author: {
      name: article.author.name,
      url: article.author.links.website,
    },
  });
}

export async function generateStaticParams() {
  const articles = getAllArticleSlugsAndTypesAndIndustries();

  return (await articles).map((article) => ({
    industry: article.industry.slug,
    type: article.type,
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    return notFound();
  }

  return <ArticleComponents article={article} />;
}
