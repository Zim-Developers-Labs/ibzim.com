'use server';

import { meiliSearchIndex } from './client';
import { globalGETRateLimit } from '../server/request';

export interface QuerySuggestion {
  id: string;
  title: string;
}

export interface SuggestionsResponse {
  suggestions: QuerySuggestion[];
  error?: string;
  query: string;
}

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 8;

export async function getQuerySuggestions(
  query: string,
): Promise<SuggestionsResponse> {
  // Validate query length
  const trimmedQuery = query?.trim() ?? '';

  if (trimmedQuery.length < MIN_QUERY_LENGTH) {
    return { suggestions: [], query: trimmedQuery };
  }

  // Rate limiting
  if (!(await globalGETRateLimit())) {
    return {
      error: 'Too many requests. Please slow down.',
      suggestions: [],
      query: trimmedQuery,
    };
  }

  try {
    const searchResults = await meiliSearchIndex.search(trimmedQuery, {
      limit: MAX_RESULTS,
      attributesToRetrieve: ['id', 'title'],
    });

    return {
      suggestions: searchResults.hits as QuerySuggestion[],
      query: trimmedQuery,
    };
  } catch (error) {
    console.error('Meilisearch autocomplete error:', error);
    return {
      error: 'Search temporarily unavailable',
      suggestions: [],
      query: trimmedQuery,
    };
  }
}
