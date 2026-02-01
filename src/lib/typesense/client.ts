/*
 * Our JavaScript client library works on both the server and the browser.
 * When using the library on the browser, please be sure to use the
 * search-only API Key rather than the master API key since the latter
 * has write access to Typesense and you don't want to expose that.
 */

import { env } from '@/env';
import Typesense from 'typesense';

const isLocal = env.NODE_ENV === 'development';

const client = new Typesense.Client({
  nodes: isLocal
    ? [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http',
        },
      ]
    : [
        {
          host: 'bo0xwvmspi34yel5p-1.a1.typesense.net',
          port: 443,
          protocol: 'https',
        },
        {
          host: 'bo0xwvmspi34yel5p-2.a1.typesense.net',
          port: 443,
          protocol: 'https',
        },
        {
          host: 'bo0xwvmspi34yel5p-3.a1.typesense.net',
          port: 443,
          protocol: 'https',
        },
      ],
  // Use 'xyz' for local dev, otherwise use the real key from env
  apiKey: isLocal ? 'xyz' : env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 10,
});

export const typesenseSearchIndex = client.collections('search_index');
export const typesensePredictionsIndex = client.collections('keywords_index');
