import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from './api';
import { env } from '@/env';
import {
  CategoryTitleType,
  NomineeType,
  NotificationType,
  SanityAwardCategoryType,
  SchoolPickerProfilesType,
  SearchDocumentType,
} from '@/types';
import {
  allSchoolsByLevelQuery,
  awardCategoriesQuery,
  awardCategoryBySlugQuery,
  categoryTitlesBySlugsQuery,
  documentsForSearchQuery,
  notificationsQuery,
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
