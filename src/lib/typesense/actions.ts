'use server';

import { SearchResponseHit } from 'typesense/lib/Typesense/Documents';
import { globalGETRateLimit } from '../server/request';
import { typesensePredictionsIndex } from './client';

export interface QueryPrediction {
  term: string;
  volume: number;
}

export interface SuggestionsResponse {
  predictions: SearchResponseHit<QueryPrediction>[];
  error?: string;
  query: string;
}

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 8;

export async function getQueryPredictions(
  query: string,
): Promise<SuggestionsResponse> {
  // Validate query length
  const trimmedQuery = query?.trim() ?? '';

  if (trimmedQuery.length < MIN_QUERY_LENGTH) {
    return { predictions: [], query: trimmedQuery };
  }

  // Rate limiting
  if (!(await globalGETRateLimit())) {
    return {
      error: 'Too many requests. Please slow down.',
      predictions: [],
      query: trimmedQuery,
    };
  }

  try {
    const searchResults = await typesensePredictionsIndex.documents().search({
      q: trimmedQuery,
      query_by: 'term',
      sort_by: 'volume:desc',
      limit: MAX_RESULTS,
    });

    return {
      predictions: searchResults.hits as SearchResponseHit<QueryPrediction>[],
      query: trimmedQuery,
    };
  } catch (error) {
    console.error('Typesense prediction error:', error);
    return {
      error: 'Search temporarily unavailable',
      predictions: [],
      query: trimmedQuery,
    };
  }
}
