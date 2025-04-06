import ArticleWrapper from '@/components/article';
import { getComments } from '@/components/comments/comments-lib';
import { prepareArticleMetadata } from '@/lib/article-metadata';
import { validateRequest } from '@/lib/auth/validate-request';
import { siteConfig } from '@/lib/config';
import {
  getAllArticleSlugsAndTypesAndIndustriesByBlog,
  getArticleBySlugAndBlog,
} from '@/lib/sanity/client';
import { urlForImage } from '@/lib/sanity/image';
import { ArticleType } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ industry: string; type: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, slug, type } = await params;
  const [articles]: [ArticleType[]] = await Promise.all([
    getArticleBySlugAndBlog(
      slug,
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.article`
        : 'article',
    ),
  ]);
  const article = articles[0];

  return prepareArticleMetadata({
    title: article?.seo.title,
    description: article?.seo.description,
    pageUrl: `/${industry}/${type}/${slug}`,
    ogImage: {
      url: urlForImage(article?.seo.image)
        .height(675)
        .width(1200)
        .fit('crop')
        .url(),
      height: 675,
      width: 1200,
    },
    siteConfig,
    author: {
      name: article?.author.name,
      url: article?.author.links.website,
    },
  });
}

export async function generateStaticParams() {
  const articles = getAllArticleSlugsAndTypesAndIndustriesByBlog(
    siteConfig.documentPrefix !== ''
      ? `${siteConfig.documentPrefix}.article`
      : 'article',
  );

  return (await articles).map((article) => ({
    industry: article.industry.slug,
    type: article.type,
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const [articles]: [ArticleType[]] = await Promise.all([
    getArticleBySlugAndBlog(
      slug,
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.article`
        : 'article',
    ),
  ]);

  const article = articles[0];

  if (!article?._id) {
    return notFound();
  }

  const { parentComments, allComments } = await getComments(article._id);

  const { user } = await validateRequest();

  return (
    <ArticleWrapper
      article={article}
      user={user}
      parentComments={parentComments}
      allComments={allComments}
    />
  );
}
