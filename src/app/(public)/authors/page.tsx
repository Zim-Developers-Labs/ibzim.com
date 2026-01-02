import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { AuthorType, CardArticleType } from '@/types';
import { Metadata } from 'next';
import AuthorsLayout from './component';
import { getAllArticles, getAllAuthors } from '@/lib/sanity/client';

export const generateMetadata = (): Metadata =>
  preparePageMetadata({
    title: `All IB Authors`,
    description: `Members of IBZim working towards authoring authentic information.`,
    pageUrl: '/authors',
    imageUrl: '/banner.webp',
  });

export default async function AuthorsPage() {
  const [authors, articles]: [AuthorType[], CardArticleType[]] =
    await Promise.all([getAllAuthors(), getAllArticles()]);

  return <AuthorsLayout articles={articles} authors={authors} />;
}
