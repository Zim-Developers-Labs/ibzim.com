import AuthorLayout from '@/components/authors/author';
import { prepareArticleMetadata } from '@/lib/article-metadata';
import { siteConfig } from '@/lib/config';
import {
  getAllArticles,
  getAllAuthorSlugs,
  getAuthorBySlug,
} from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { AuthorType, CardArticleType } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [author]: [AuthorType | null] = await Promise.all([
    getAuthorBySlug((await params).slug),
  ]);

  return prepareArticleMetadata({
    title: `${author?.name} | IBZim`,
    description: author?.bio,
    pageUrl: `/authors/${(await params).slug}`,
    ogImage: {
      url: urlForImage(author!.picture)
        .height(500)
        .width(500)
        .fit('crop')
        .url(),
      height: 500,
      width: 500,
    },
    siteConfig,
  });
}

export async function generateStaticParams() {
  const authors = await getAllAuthorSlugs();

  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const [articles, author]: [CardArticleType[], AuthorType | null] =
    await Promise.all([getAllArticles(), getAuthorBySlug(slug)]);

  if (!author?._id) {
    return notFound();
  }

  const authorArticles = articles.filter(
    (article) => article.author?.slug.current == slug,
  );

  return (
    <>
      <AuthorLayout articles={authorArticles} author={author} />
    </>
  );
}
