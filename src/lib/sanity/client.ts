import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from './api';
import { env } from '@/env';
import {
  NotificationType,
  SchoolPickerProfilesType,
  SearchDocumentType,
} from '@/types';
import {
  allSchoolsByLevelQuery,
  documentsForSearchQuery,
  notificationsQuery,
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
