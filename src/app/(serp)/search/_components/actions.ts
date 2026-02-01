'use server';

import { typesenseSearchIndex } from '@/lib/typesense/client';
import { SearchIndexEntry } from '../../../../types';
import { logSearch } from '@/lib/tinybird/analytics';
import { getCurrentSession } from '@/lib/server/session';
import { headers } from 'next/headers';
import parseUserAgent from '@/lib/server/user-agent';

export interface FetchAllEntriesResult {
  entries: SearchIndexEntry[];
  timeTaken: number;
}

export async function getResultsForQuery(
  query: string,
): Promise<FetchAllEntriesResult | null> {
  try {
    const searchResults = await typesenseSearchIndex.documents().search({
      q: query,
      query_by: 'name,description,content,embedding',
      prefix: 'true,true,false,false',
      query_by_weights: '4,1,2,1',
      prioritize_exact_match: true,
      per_page: 66,
      page: 1,
    });

    const hits = searchResults.hits || [];
    const timeTaken = searchResults.search_time_ms || 0;

    // Map the documents
    const entries = hits.map((hit) => hit.document as SearchIndexEntry);

    return {
      entries: entries,
      timeTaken: timeTaken,
    };
  } catch (error) {
    console.error('Typesense search error:', error);
    return null;
  }
}

type SearchLogData = {
  searchId: string;
  q: string;
  resultUrls: string[]; // Pass simple array of strings to keep payload small
};

export async function trackSearchView(data: SearchLogData) {
  const { user } = await getCurrentSession();
  const headersList = await headers();

  // Reconstruct the device/IP data inside the action
  const userAgent = headersList.get('user-agent') || '';
  const { deviceType, deviceName, browserName, browserVersion } =
    parseUserAgent(userAgent);

  // Vercel-Specific Geolocation (Zero Latency)
  const city = headersList.get('x-vercel-ip-city');
  const country = headersList.get('x-vercel-ip-country'); // Returns 2-letter code like 'ZW' or 'US'

  let location = 'Unknown';

  if (city && country) {
    // Decode ensures special characters in city names are handled correctly
    location = `${decodeURIComponent(city)}, ${country}`;
  } else if (process.env.NODE_ENV === 'development') {
    // Fallback for localhost (where Vercel headers don't exist)
    location = 'Harare, Zimbabwe (Dev)';
  }

  const detailedDeviceData = {
    device_type: deviceType,
    browser_name: browserName,
    browser_version: browserVersion,
    os_name: deviceName,
    location,
  };

  // Format results for your logger
  const formattedResults: [number, string][] = data.resultUrls.map(
    (url, index) => [index + 1, url],
  );

  // Execute the log
  await logSearch(
    data.searchId,
    data.q,
    user ? user.id : null,
    formattedResults,
    detailedDeviceData,
  );
}
