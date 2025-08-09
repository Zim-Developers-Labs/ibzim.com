import HomeWrapper from '@/components/home';
import { validateRequest } from '@/lib/auth/validate-request';
import { siteConfig } from '@/lib/config';
import { preparePageMetadata } from '@/lib/metadata';
import { getSearchData } from '@/sanity/lib/actions';
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
    pageUrl: '/articles',
    imageUrl: '/banner.webp',
    siteConfig,
  });
}

export default async function BlogHomePage() {
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

  const { user } = await validateRequest();

  const { allArticles, popularArticles } = await getSearchData(
    siteConfig.popularArticleIds,
    siteConfig.documentPrefix,
  );

  return (
    <HomeWrapper
      user={user}
      allArticles={allArticles}
      popularArticles={popularArticles}
      authors={authors}
      profiles={profiles}
      articles={articles}
      home={home[0]!}
    />
  );
}
