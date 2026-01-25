import { prepareArticleMetadata } from '@/lib/article-metadata';
import {
  getAllArticles,
  getAllAuthorSlugs,
  getAuthorBySlug,
} from '@/lib/sanity/client';
import { urlForImage } from '@/lib/sanity/image';
import { AuthorType, CardArticleType } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AuthorLayout from './component';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const author = await getAuthorBySlug(slug);

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
