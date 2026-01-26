'use server';

import { getAllDocumentsForSearch } from './client';

export async function getSearchData() {
  const allDocuments = await getAllDocumentsForSearch();

  return { allDocuments };
}
