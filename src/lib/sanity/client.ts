import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from './api';
import { env } from '@/env';
import {
  ArticleType,
  AuthorType,
  CardArticleType,
  CardNewsArticleType,
  CardProfileType,
  CategoryTitleType,
  HomeType,
  NewsArticleType,
  NomineeType,
  NotificationType,
  ProfileType,
  SanityAwardCategoryType,
  SchoolPickerProfilesType,
  SearchDocumentType,
} from '@/types';
import {
  allArticlesQuery,
  allAuthorsQuery,
  allNewsArticlesQuery,
  allProfilesForListingQuery,
  allSchoolsByLevelQuery,
  articleBySlyugQuery,
  articleSlugAndTypeAndIndustryQuery,
  awardCategoriesQuery,
  awardCategoryBySlugQuery,
  categoryTitlesBySlugsQuery,
  documentsForSearchQuery,
  homeQuery,
  newsArticleBySlugQuery,
  newsArticleSlugsAndIndustriesQuery,
  notificationsQuery,
  profileBySlugQuery,
  profileSlugsAndTypeQuery,
  titleNomineesByTitleSlugQuery,
} from './queries';

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  perspective: 'published',
  useCdn: env.NODE_ENV === 'production',
});

export async function getAllDocumentsForSearch(): Promise<
  SearchDocumentType[]
> {
  if (client) {
    return (await client.fetch(documentsForSearchQuery)) || {};
  }
  return [];
}

export async function getAllNotifications(): Promise<NotificationType[]> {
  if (client) {
    return (await client.fetch(notificationsQuery)) || {};
  }
  return [];
}

export async function getAllSchoolsByLevel(
  level: string,
): Promise<SchoolPickerProfilesType[]> {
  if (client) {
    return (await client.fetch(allSchoolsByLevelQuery, { level })) || [];
  }
  return [];
}

export async function getAllAwardCategories(): Promise<
  SanityAwardCategoryType[]
> {
  if (client) {
    return (await client.fetch(awardCategoriesQuery)) || [];
  }
  return [];
}

export async function getAwardCategoryBySlug(
  slug: string,
): Promise<SanityAwardCategoryType | null> {
  if (client) {
    return (await client.fetch(awardCategoryBySlugQuery, { slug })) || null;
  }
  return null;
}

export async function getCategoryTitlesByCategorySlug(
  categorySlug: string,
): Promise<CategoryTitleType[]> {
  if (client) {
    return (
      (await client.fetch(categoryTitlesBySlugsQuery, { categorySlug })) || {}
    ).categoryTitles;
  }
  return [];
}

export async function getTitleNomineesByTitleSlug(
  titleSlug: string,
): Promise<NomineeType[]> {
  if (client) {
    return (
      (await client.fetch(titleNomineesByTitleSlugQuery, { titleSlug })) || {}
    ).nominees;
  }
  return [];
}

export async function getHome(): Promise<HomeType | null> {
  if (client) {
    return (await client.fetch(homeQuery)) || null;
  }
  return null;
}

export async function getAllArticles(): Promise<CardArticleType[]> {
  if (client) {
    return (await client.fetch(allArticlesQuery)) || [];
  }
  return [];
}

export async function getAllProfilesForListing(): Promise<CardProfileType[]> {
  if (client) {
    return (await client.fetch(allProfilesForListingQuery)) || [];
  }
  return [];
}

export async function getAllAuthors(): Promise<AuthorType[]> {
  if (client) {
    return (await client.fetch(allAuthorsQuery)) || {};
  }
  return [];
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleType | null> {
  if (client) {
    return (await client.fetch(articleBySlyugQuery, { slug })) || null;
  }
  return null;
}

export async function getAllArticleSlugsAndTypesAndIndustries(): Promise<
  {
    slug: string;
    type: string;
    industry: { slug: string };
  }[]
> {
  if (client) {
    return (await client.fetch(articleSlugAndTypeAndIndustryQuery)) || {};
  }
  return [];
}

export async function getProfileBySlug(
  slug: string,
): Promise<ProfileType | null> {
  if (client) {
    return (
      (await client.fetch(profileBySlugQuery, {
        slug,
      })) || null
    );
  }
  return null;
}

export async function getAllProfileSlugsAndType(): Promise<
  { slug: string; type: string; _updatedAt?: string; _id: string }[]
> {
  if (client) {
    return (await client.fetch(profileSlugsAndTypeQuery)) || {};
  }
  return [];
}

export async function getAllNewsArticles(): Promise<CardNewsArticleType[]> {
  if (client) {
    return (await client.fetch(allNewsArticlesQuery)) || [];
  }
  return [];
}

export async function getNewsArticleBySlug(
  slug: string,
): Promise<NewsArticleType> {
  if (client) {
    return (await client.fetch(newsArticleBySlugQuery, { slug })) || {};
  }
  return {} as NewsArticleType;
}

export async function getAllNewsArticleSlugsAndIndustries(): Promise<
  {
    slug: string;
    industry: string;
  }[]
> {
  if (client) {
    return (await client.fetch(newsArticleSlugsAndIndustriesQuery)) || {};
  }
  return [];
}
