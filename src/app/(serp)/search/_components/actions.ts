'use server';

import { typesenseSearchIndex } from '@/lib/typesense/client';
import { SearchIndexEntry } from '../../../../types';

export interface FetchAllEntriesResult {
  entries: SearchIndexEntry[];
  timeTaken: number;
}

export async function getResultsForQuery(
  query: string,
): Promise<FetchAllEntriesResult | null> {
  const perPage = 250;
  let currentPage = 1;
  let allEntries: SearchIndexEntry[] = [];
  let timeTaken = 0;
  let keepFetching = true;

  try {
    while (keepFetching) {
      const searchResults = await typesenseSearchIndex.documents().search({
        q: query,
        query_by: 'description',
        per_page: perPage,
        page: currentPage,
      });
      const hits = searchResults.hits || [];
      timeTaken += searchResults.search_time_ms || 0;

      if (hits.length > 0) {
        const pageDocs = hits.map((hit) => hit.document as SearchIndexEntry);
        allEntries = [...allEntries, ...pageDocs];
        // If we received fewer than 250 results, we've reached the last page
        if (hits.length < perPage) {
          keepFetching = false;
        } else {
          currentPage++;
        }
      } else {
        // No more hits found
        keepFetching = false;
      }
    }

    return {
      entries: allEntries,
      timeTaken: timeTaken,
    };
  } catch (error) {
    console.error('Typesense search error:', error);
    return null;
  }
}
