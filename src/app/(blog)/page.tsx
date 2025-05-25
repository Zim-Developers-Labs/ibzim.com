import HomeWrapper from '@/components/home';
import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import {
  getAllArticlesByBlog,
  getAllAuthors,
  getAllProfilesForListingByBlog,
  getHome,
} from '@/sanity/lib/client';
import {
  AuthorType,
  CardArticleType,
  CardProfileType,
  HomeType,
} from '@/types';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const [homes]: [HomeType[]] = await Promise.all([
    getHome(
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.home`
        : 'home',
    ),
  ]);
  const home: HomeType = homes[0]!;

  return preparePageMetadata({
    title: home.seo.title,
    description: home.seo.description,
    pageUrl: '/',
    imageUrl: '/banner.webp',
    siteConfig,
  });
}

export default async function HomePage() {
  const [articles, home, profiles, authors]: [
    CardArticleType[],
    HomeType[],
    CardProfileType[],
    AuthorType[],
  ] = await Promise.all([
    getAllArticlesByBlog(
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.article`
        : 'article',
    ),
    getHome(
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.home`
        : 'home',
    ),
    getAllProfilesForListingByBlog(
      siteConfig.documentPrefix !== ''
        ? `${siteConfig.documentPrefix}.profile`
        : 'profile',
    ),
    getAllAuthors(),
  ]);

  return (
    <HomeWrapper
      authors={authors}
      profiles={profiles}
      articles={articles}
      home={home[0]!}
    />
  );
}
