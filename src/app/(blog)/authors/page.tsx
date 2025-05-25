import AuthorsLayout from '@/components/authors';
import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { getAllArticles, getAllAuthors } from '@/lib/sanity/client';
import { AuthorType, CardArticleType } from '@/types';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `All IB Authors`,
    description: `Members of IBZim working towards authoring authentic information.`,
    pageUrl: '/authors',
    imageUrl: '/banner.webp',
    siteConfig,
  });

export default async function AuthorsPage() {
  const [authors, articles]: [AuthorType[], CardArticleType[]] =
    await Promise.all([getAllAuthors(), getAllArticles()]);

  return <AuthorsLayout articles={articles} authors={authors} />;
}
