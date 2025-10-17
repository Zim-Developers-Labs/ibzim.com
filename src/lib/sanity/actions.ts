'use server';

import { getAllDocumentsForSearch } from './client';

export async function getSearchData(popularArticleIds: string[]) {
  const allDocuments = await getAllDocumentsForSearch();

  const popularArticles = allDocuments.filter((article: any) =>
    popularArticleIds?.includes(article._id),
  );

  return { allDocuments, popularArticles };
}
