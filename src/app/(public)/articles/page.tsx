import { preparePageMetadata } from '@/lib/metadata';
import {
  getAllArticles,
  getAllAuthors,
  getAllProfilesForListing,
  getHome,
} from '@/lib/sanity/client';
import { Metadata } from 'next';
import ArticlesComponents from './_components';

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();

  return preparePageMetadata({
    title: home ? home.seo.title : 'IBZim Blog',
    description: home
      ? home.seo.description
      : 'All about Zimbabwe. Read through our well written how to guides, comparisons, listicles, case studies and more.',
    pageUrl: '/articles',
    imageUrl: '/banner.webp',
  });
}

export default async function ArticlesListingPage() {
  const [articles, home, profiles, authors] = await Promise.all([
    getAllArticles(),
    getHome(),
    getAllProfilesForListing(),
    getAllAuthors(),
  ]);

  return (
    <ArticlesComponents
      authors={authors}
      profiles={profiles}
      articles={articles}
      home={home!}
    />
  );
}
